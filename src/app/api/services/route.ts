import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/db";

// ============================================================
// GET SERVICES
// ============================================================

export async function GET() {
  try {
    const services = await prisma.service.findMany({
      orderBy: [
        {
          sortOrder: "asc",
        },
        {
          createdAt: "desc",
        },
      ],
    });

    return NextResponse.json({
      success: true,
      data: services,
    });
  } catch (error) {
    console.error("GET services error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil data services.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// POST SERVICE
// ============================================================

export async function POST(request: NextRequest) {
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

    const body = await request.json();

    const {
      title,
      slug,
      description,
      icon,
      published,
      sortOrder,
    } = body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (!title || typeof title !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Judul service wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (!slug || typeof slug !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Slug service wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (!description || typeof description !== "string") {
      return NextResponse.json(
        {
          success: false,
          message: "Deskripsi service wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // ========================================================
    // CHECK SLUG
    // ========================================================

    const existingService = await prisma.service.findUnique({
      where: {
        slug,
      },
    });

    if (existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Slug service sudah digunakan.",
        },
        {
          status: 409,
        }
      );
    }

    // ========================================================
    // CREATE SERVICE
    // ========================================================

    const service = await prisma.service.create({
      data: {
        title,
        slug,
        description,
        icon: icon || null,
        published:
          published !== undefined ? Boolean(published) : true,
        sortOrder:
          sortOrder !== undefined ? Number(sortOrder) || 0 : 0,
      },
    });

    return NextResponse.json(
      {
        success: true,
        message: "Service berhasil dibuat.",
        data: service,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal membuat service.",
      },
      {
        status: 500,
      }
    );
  }
}