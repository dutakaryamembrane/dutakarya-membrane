import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { prisma } from "@/lib/prisma";
import { cloudinary } from "@/lib/storage";
import { authOptions } from "@/lib/auth";

// ============================================================
// HELPER - CEK ADMIN
// ============================================================

async function requireAdmin() {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Silakan login terlebih dahulu.",
        },
        {
          status: 401,
        }
      ),
    };
  }

  const userRole = (session.user as any).role;

  if (userRole !== "ADMIN") {
    return {
      ok: false as const,
      response: NextResponse.json(
        {
          success: false,
          message: "Forbidden. Hanya ADMIN yang dapat mengelola media.",
        },
        {
          status: 403,
        }
      ),
    };
  }

  return {
    ok: true as const,
    session,
    userRole,
  };
}

// ============================================================
// HELPER - CARI PROJECT
// ============================================================

async function findProject(slug: string) {
  return prisma.project.findUnique({
    where: {
      slug,
    },
  });
}

// ============================================================
// GET
// Ambil semua media yang terhubung ke project
// ============================================================

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    const { slug } = await params;

    const project = await findProject(slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    const projectMedias = await prisma.projectMedia.findMany({
      where: {
        projectId: project.id,
      },

      orderBy: [
        {
          isCover: "desc",
        },
        {
          sortOrder: "asc",
        },
        {
          createdAt: "asc",
        },
      ],

      include: {
        media: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: projectMedias.length,
      data: projectMedias,
    });
  } catch (error) {
    console.error("GET project media error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil media project.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST
// Upload media baru ke Cloudinary + database
// ============================================================

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // =========================================================
    // 1. CEK SESSION + ROLE
    // =========================================================

    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    const { session, userRole } = admin;

    // =========================================================
    // 2. AMBIL SLUG
    // =========================================================

    const { slug } = await params;

    // =========================================================
    // 3. CARI PROJECT
    // =========================================================

    const project = await findProject(slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 4. AMBIL FORMDATA
    // =========================================================

    const formData = await request.formData();

    const file = formData.get("file");

    const altText = String(
      formData.get("altText") || project.title
    );

    const caption = String(
      formData.get("caption") || ""
    );

    const isCover =
      String(formData.get("isCover") || "false") ===
      "true";

    // =========================================================
    // 5. VALIDASI FILE
    // =========================================================

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File wajib dikirim.",
        },
        {
          status: 400,
        }
      );
    }

    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        {
          success: false,
          message: "File harus berupa gambar.",
        },
        {
          status: 400,
        }
      );
    }

    const maxSize = 10 * 1024 * 1024;

    if (file.size > maxSize) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran gambar maksimal 10MB.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 6. FILE → BUFFER
    // =========================================================

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // =========================================================
    // 7. UPLOAD KE CLOUDINARY
    // ============================================================

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      width?: number;
      height?: number;
      format?: string;
      bytes?: number;
    }>((resolve, reject) => {
      const uploadStream =
        cloudinary.uploader.upload_stream(
          {
            folder: `duta-karya-membrane/projects/${slug}`,
            resource_type: "image",
          },

          (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(
                new Error(
                  "Cloudinary tidak mengembalikan hasil upload."
                )
              );
              return;
            }

            resolve(result);
          }
        );

      uploadStream.end(buffer);
    });

    // =========================================================
    // 8. JIKA COVER BARU,
    // RESET COVER LAMA
    // =========================================================

    if (isCover) {
      await prisma.projectMedia.updateMany({
        where: {
          projectId: project.id,
          isCover: true,
        },

        data: {
          isCover: false,
        },
      });
    }

    // =========================================================
    // 9. SIMPAN MEDIA
    // =========================================================

    const media = await prisma.media.create({
      data: {
        type: "IMAGE",
        source: "UPLOAD",

        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,

        filename: file.name,
        mimeType: file.type,

        size: uploadResult.bytes ?? file.size,

        width: uploadResult.width ?? null,
        height: uploadResult.height ?? null,

        altText,
        caption,
      },
    });

    // =========================================================
    // 10. TENTUKAN SORT ORDER
    // =========================================================

    const lastProjectMedia =
      await prisma.projectMedia.findFirst({
        where: {
          projectId: project.id,
        },

        orderBy: {
          sortOrder: "desc",
        },
      });

    const sortOrder = lastProjectMedia
      ? lastProjectMedia.sortOrder + 1
      : 0;

    // =========================================================
    // 11. HUBUNGKAN MEDIA DENGAN PROJECT
    // =========================================================

    const projectMedia =
      await prisma.projectMedia.create({
        data: {
          projectId: project.id,
          mediaId: media.id,
          sortOrder,
          isCover,
        },

        include: {
          media: true,
        },
      });

    // =========================================================
    // 12. RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,

      message: "Media project berhasil diupload.",

      project: {
        id: project.id,
        title: project.title,
        slug: project.slug,
      },

      uploadedBy: {
        id: (session.user as any).id,
        email: (session.user as any).email,
        role: userRole,
      },

      data: {
        projectMediaId: projectMedia.id,
        sortOrder: projectMedia.sortOrder,
        isCover: projectMedia.isCover,
        media: projectMedia.media,
      },
    });
  } catch (error) {
    console.error(
      "Project media upload error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload media project.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// PATCH
//
// Digunakan untuk:
// - Mengubah Cover
// - Mengubah Sort Order
// - Mengubah Alt Text
// - Mengubah Caption
// ============================================================

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // =========================================================
    // 1. CEK ADMIN
    // =========================================================

    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    const { slug } = await params;

    // =========================================================
    // 2. CARI PROJECT
    // =========================================================

    const project = await findProject(slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 3. BACA BODY
    // =========================================================

    const body = await request.json();

    const projectMediaId =
      typeof body.projectMediaId === "string"
        ? body.projectMediaId
        : "";

    if (!projectMediaId) {
      return NextResponse.json(
        {
          success: false,
          message: "projectMediaId wajib dikirim.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 4. CARI RELASI MEDIA
    // =========================================================

    const projectMedia =
      await prisma.projectMedia.findFirst({
        where: {
          id: projectMediaId,
          projectId: project.id,
        },

        include: {
          media: true,
        },
      });

    if (!projectMedia) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Media tidak ditemukan pada project ini.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 5. SIAPKAN NILAI UPDATE
    // =========================================================

    const hasIsCover =
      typeof body.isCover === "boolean";

    const hasSortOrder =
      typeof body.sortOrder === "number" &&
      Number.isFinite(body.sortOrder);

    const hasAltText =
      typeof body.altText === "string";

    const hasCaption =
      typeof body.caption === "string";

    const isCover = hasIsCover
      ? body.isCover
      : projectMedia.isCover;

    const sortOrder = hasSortOrder
      ? Math.max(0, Math.floor(body.sortOrder))
      : projectMedia.sortOrder;

    // =========================================================
    // 6. UPDATE DATABASE
    // =========================================================

    const updatedProjectMedia =
      await prisma.$transaction(async (tx) => {
        // -------------------------------------------------------
        // Jika media ini menjadi cover,
        // lepas cover dari media lain.
        // -------------------------------------------------------

        if (isCover) {
          await tx.projectMedia.updateMany({
            where: {
              projectId: project.id,

              id: {
                not: projectMedia.id,
              },

              isCover: true,
            },

            data: {
              isCover: false,
            },
          });
        }

        // -------------------------------------------------------
        // Update ProjectMedia
        // -------------------------------------------------------

        const updated =
          await tx.projectMedia.update({
            where: {
              id: projectMedia.id,
            },

            data: {
              isCover,
              sortOrder,
            },

            include: {
              media: true,
            },
          });

        // -------------------------------------------------------
        // Update metadata Media
        // -------------------------------------------------------

        if (hasAltText || hasCaption) {
          await tx.media.update({
            where: {
              id: projectMedia.mediaId,
            },

            data: {
              ...(hasAltText
                ? {
                    altText:
                      body.altText.trim() || null,
                  }
                : {}),

              ...(hasCaption
                ? {
                    caption:
                      body.caption.trim() || null,
                  }
                : {}),
            },
          });
        }

        // -------------------------------------------------------
        // Ambil ulang supaya metadata media terbaru
        // ikut dikirim ke client.
        // -------------------------------------------------------

        return tx.projectMedia.findUnique({
          where: {
            id: updated.id,
          },

          include: {
            media: true,
          },
        });
      });

    // =========================================================
    // 7. RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,
      message: "Media project berhasil diperbarui.",
      data: updatedProjectMedia,
    });
  } catch (error) {
    console.error(
      "PATCH project media error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal memperbarui media project.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE
//
// Menghapus:
// 1. Relasi ProjectMedia
// 2. Media database jika sudah tidak dipakai
// 3. File Cloudinary jika merupakan upload aplikasi
//
// Jika cover dihapus dan masih ada gambar lain,
// gambar pertama otomatis dijadikan cover.
// ============================================================

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    // =========================================================
    // 1. CEK ADMIN
    // =========================================================

    const admin = await requireAdmin();

    if (!admin.ok) {
      return admin.response;
    }

    const { slug } = await params;

    // =========================================================
    // 2. CARI PROJECT
    // =========================================================

    const project = await findProject(slug);

    if (!project) {
      return NextResponse.json(
        {
          success: false,
          message: "Project tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // =========================================================
    // 3. BACA BODY
    // =========================================================

    const body = await request.json();

    const projectMediaId =
      typeof body.projectMediaId === "string"
        ? body.projectMediaId
        : "";

    if (!projectMediaId) {
      return NextResponse.json(
        {
          success: false,
          message:
            "projectMediaId wajib dikirim.",
        },
        {
          status: 400,
        }
      );
    }

    // =========================================================
    // 4. CARI MEDIA
    // =========================================================

    const projectMedia =
      await prisma.projectMedia.findFirst({
        where: {
          id: projectMediaId,
          projectId: project.id,
        },

        include: {
          media: true,
        },
      });

    if (!projectMedia) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Media tidak ditemukan pada project ini.",
        },
        {
          status: 404,
        }
      );
    }

    // Simpan informasi sebelum database diubah.
    const wasCover = projectMedia.isCover;
    const mediaId = projectMedia.mediaId;
    const media = projectMedia.media;

    // =========================================================
    // 5. HAPUS RELASI PROJECT MEDIA
    // =========================================================

    await prisma.projectMedia.delete({
      where: {
        id: projectMedia.id,
      },
    });

    // =========================================================
    // 6. CEK APAKAH MEDIA MASIH DIGUNAKAN
    // =========================================================

    const remainingRelations =
      await prisma.projectMedia.count({
        where: {
          mediaId,
        },
      });

    // =========================================================
    // 7. JIKA MEDIA SUDAH TIDAK DIGUNAKAN,
    // HAPUS MEDIA DARI DATABASE
    // =========================================================

    if (remainingRelations === 0) {
      await prisma.media.delete({
        where: {
          id: mediaId,
        },
      });

      // -------------------------------------------------------
      // Hapus asset dari Cloudinary jika memang upload.
      // -------------------------------------------------------

      if (
        media.source === "UPLOAD" &&
        media.publicId
      ) {
        try {
          await cloudinary.uploader.destroy(
            media.publicId,
            {
              resource_type: "image",
              invalidate: true,
            }
          );
        } catch (cloudinaryError) {
          console.error(
            "Cloudinary delete error:",
            cloudinaryError
          );
        }
      }
    }

    // =========================================================
    // 8. JIKA YANG DIHAPUS ADALAH COVER,
    // PILIH COVER BARU
    // =========================================================

    let promotedCoverId: string | null = null;

    if (wasCover) {
      const nextMedia =
        await prisma.projectMedia.findFirst({
          where: {
            projectId: project.id,
          },

          orderBy: [
            {
              sortOrder: "asc",
            },

            {
              createdAt: "asc",
            },
          ],
        });

      if (nextMedia) {
        const promoted =
          await prisma.projectMedia.update({
            where: {
              id: nextMedia.id,
            },

            data: {
              isCover: true,
            },
          });

        promotedCoverId = promoted.id;
      }
    }

    // =========================================================
    // 9. RESPONSE
    // =========================================================

    return NextResponse.json({
      success: true,

      message: "Media project berhasil dihapus.",

      data: {
        deletedProjectMediaId: projectMedia.id,
        deletedMediaId: mediaId,
        promotedCoverId,
      },
    });
  } catch (error) {
    console.error(
      "DELETE project media error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal menghapus media project.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown error",
      },
      {
        status: 500,
      }
    );
  }
}