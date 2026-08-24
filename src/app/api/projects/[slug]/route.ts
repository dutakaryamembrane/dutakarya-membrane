import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    slug: string;
  }>;
};

// ==========================================
// GET DETAIL PROJECT
// ==========================================
export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { slug } = await context.params;

    const project = await prisma.project.findUnique({
      where: {
        slug,
      },
      include: {
        medias: {
          include: {
            media: true,
          },
          orderBy: {
            sortOrder: "asc",
          },
        },
        materials: true,
      },
    });

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

    return NextResponse.json({
      success: true,
      data: project,
    });
  } catch (error) {
    console.error("GET project error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail project.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// UPDATE PROJECT
// ==========================================
export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const role = (session.user as { role?: string }).role;

    if (role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden",
        },
        {
          status: 403,
        }
      );
    }

    const { slug } = await context.params;

    const body = await request.json();

    const existingProject = await prisma.project.findUnique({
      where: {
        slug,
      },
    });

    if (!existingProject) {
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

    const {
      title,
      newSlug,
      description,
      client,
      location,
      category,
      completionDate,
      published,
      featured,
      area,
      structure,
      membrane,
      technicalNotes,
      seoTitle,
      seoDescription,
      seoKeywords,
      ogImage,
      sortOrder,
    } = body;

    const updatedProject = await prisma.project.update({
      where: {
        slug,
      },
      data: {
        ...(title !== undefined && {
          title,
        }),

        ...(newSlug !== undefined && {
          slug: newSlug,
        }),

        ...(description !== undefined && {
          description,
        }),

        ...(client !== undefined && {
          client,
        }),

        ...(location !== undefined && {
          location,
        }),

        ...(category !== undefined && {
          category,
        }),

        ...(completionDate !== undefined && {
          completionDate: completionDate
            ? new Date(completionDate)
            : null,
        }),

        ...(published !== undefined && {
          published,
        }),

        ...(featured !== undefined && {
          featured,
        }),

        ...(area !== undefined && {
          area,
        }),

        ...(structure !== undefined && {
          structure,
        }),

        ...(membrane !== undefined && {
          membrane,
        }),

        ...(technicalNotes !== undefined && {
          technicalNotes,
        }),

        ...(seoTitle !== undefined && {
          seoTitle,
        }),

        ...(seoDescription !== undefined && {
          seoDescription,
        }),

        ...(seoKeywords !== undefined && {
          seoKeywords,
        }),

        ...(ogImage !== undefined && {
          ogImage,
        }),

        ...(sortOrder !== undefined && {
          sortOrder,
        }),
      },
    });

    return NextResponse.json({
      success: true,
      message: "Project berhasil diperbarui.",
      data: updatedProject,
    });
  } catch (error) {
    console.error("UPDATE project error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui project.",
      },
      {
        status: 500,
      }
    );
  }
}

// ==========================================
// DELETE PROJECT
// ==========================================
export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized",
        },
        {
          status: 401,
        }
      );
    }

    const role = (session.user as { role?: string }).role;

    if (role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya ADMIN yang dapat menghapus project.",
        },
        {
          status: 403,
        }
      );
    }

    const { slug } = await context.params;

    const existingProject = await prisma.project.findUnique({
      where: {
        slug,
      },
    });

    if (!existingProject) {
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

    await prisma.$transaction(async (tx) => {
      // Hapus relasi material project terlebih dahulu
      await tx.projectMaterial.deleteMany({
        where: {
          projectId: existingProject.id,
        },
      });

      // Hapus relasi media project
      await tx.projectMedia.deleteMany({
        where: {
          projectId: existingProject.id,
        },
      });

      // Setelah seluruh relasi dilepas,
      // hapus project utama
      await tx.project.delete({
        where: {
          id: existingProject.id,
        },
      });
    });

    return NextResponse.json({
      success: true,
      message: "Project berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE project error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus project.",
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