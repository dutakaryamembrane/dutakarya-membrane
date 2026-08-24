import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/db";
import { authOptions } from "@/lib/auth";

// ============================================================
// HELPER — SLUGIFY
// ============================================================

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

// ============================================================
// GET PROJECTS
// ============================================================

export async function GET() {
  try {
    const projects = await prisma.project.findMany({
      orderBy: [
        {
          featured: "desc",
        },
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        client: true,
        location: true,
        category: true,
        completionDate: true,
        published: true,
        featured: true,
        area: true,
        structure: true,
        membrane: true,
        technicalNotes: true,
        seoTitle: true,
        seoDescription: true,
        seoKeywords: true,
        ogImage: true,
        sortOrder: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    return NextResponse.json({
      success: true,
      count: projects.length,
      data: projects,
    });
  } catch (error) {
    console.error("GET projects error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil daftar project.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST — CREATE PROJECT
// ============================================================

export async function POST(request: NextRequest) {
  try {
    // ========================================================
    // 1. CEK SESSION
    // ========================================================

    const session = await getServerSession(authOptions);

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message: "Unauthorized. Silakan login terlebih dahulu.",
        },
        {
          status: 401,
        }
      );
    }

    // ========================================================
    // 2. CEK ROLE
    // ========================================================

    const role = (session.user as { role?: string }).role;

    if (role !== "ADMIN" && role !== "EDITOR") {
      return NextResponse.json(
        {
          success: false,
          message: "Forbidden.",
        },
        {
          status: 403,
        }
      );
    }

    // ========================================================
    // 3. AMBIL BODY
    // ========================================================

    const body = await request.json();

    const {
      title,
      slug: requestedSlug,
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

    // ========================================================
    // 4. VALIDASI BASIC
    // ========================================================

    if (typeof title !== "string" || !title.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Judul project wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (typeof description !== "string" || !description.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Deskripsi project wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // 5. GENERATE / NORMALIZE SLUG
    // ========================================================

    const slug = slugify(
      typeof requestedSlug === "string" && requestedSlug.trim()
        ? requestedSlug
        : title
    );

    if (!slug) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Slug project tidak valid. Gunakan judul atau slug yang mengandung huruf/angka.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // 6. CEK SLUG DUPLIKAT
    // ========================================================

    const existingProject = await prisma.project.findUnique({
      where: {
        slug,
      },
      select: {
        id: true,
      },
    });

    if (existingProject) {
      return NextResponse.json(
        {
          success: false,
          message: `Slug "${slug}" sudah digunakan project lain.`,
        },
        {
          status: 409,
        }
      );
    }

    // ========================================================
    // 7. PARSE COMPLETION DATE
    // ========================================================

    let parsedCompletionDate: Date | null = null;

    if (
      completionDate !== null &&
      completionDate !== undefined &&
      completionDate !== ""
    ) {
      const date = new Date(completionDate);

      if (Number.isNaN(date.getTime())) {
        return NextResponse.json(
          {
            success: false,
            message: "Tanggal selesai tidak valid.",
          },
          {
            status: 400,
          }
        );
      }

      parsedCompletionDate = date;
    }

    // ========================================================
    // 8. PARSE SORT ORDER
    // ========================================================

    const parsedSortOrder =
      sortOrder === undefined ||
      sortOrder === null ||
      sortOrder === ""
        ? 0
        : Number(sortOrder);

    if (!Number.isInteger(parsedSortOrder)) {
      return NextResponse.json(
        {
          success: false,
          message: "Urutan project harus berupa angka bulat.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // 9. CREATE PROJECT
    // ========================================================

    const project = await prisma.project.create({
      data: {
        title: title.trim(),
        slug,
        description: description.trim(),

        client:
          typeof client === "string" && client.trim()
            ? client.trim()
            : null,

        location:
          typeof location === "string" && location.trim()
            ? location.trim()
            : null,

        category:
          typeof category === "string" && category.trim()
            ? category.trim()
            : null,

        completionDate: parsedCompletionDate,

        published: Boolean(published),
        featured: Boolean(featured),

        area:
          typeof area === "string" && area.trim()
            ? area.trim()
            : null,

        structure:
          typeof structure === "string" && structure.trim()
            ? structure.trim()
            : null,

        membrane:
          typeof membrane === "string" && membrane.trim()
            ? membrane.trim()
            : null,

        technicalNotes:
          typeof technicalNotes === "string" &&
          technicalNotes.trim()
            ? technicalNotes.trim()
            : null,

        seoTitle:
          typeof seoTitle === "string" && seoTitle.trim()
            ? seoTitle.trim()
            : null,

        seoDescription:
          typeof seoDescription === "string" &&
          seoDescription.trim()
            ? seoDescription.trim()
            : null,

        seoKeywords:
          typeof seoKeywords === "string" &&
          seoKeywords.trim()
            ? seoKeywords.trim()
            : null,

        ogImage:
          typeof ogImage === "string" && ogImage.trim()
            ? ogImage.trim()
            : null,

        sortOrder: parsedSortOrder,
      },
    });

    // ========================================================
    // 10. RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,
        message: "Project berhasil dibuat.",
        data: project,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST project error:", error);

    // Prisma unique constraint
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      (error as { code?: string }).code === "P2002"
    ) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug project sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat project.",
      },
      {
        status: 500,
      }
    );
  }
}