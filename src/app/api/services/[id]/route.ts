import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

// ============================================================
// GET SERVICE DETAIL
// ============================================================

export async function GET(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    const service = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!service) {
      return NextResponse.json(
        {
          success: false,
          message: "Service tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: service,
    });
  } catch (error) {
    console.error("GET service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengambil detail service.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// UPDATE SERVICE
// ============================================================

export async function PUT(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ========================================================
    // 1. CEK SESSION
    // ========================================================

    const session = await auth();

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
    // 3. AMBIL ID
    // ========================================================

    const { id } = await context.params;

    // ========================================================
    // 4. CEK SERVICE
    // ========================================================

    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================================
    // 5. AMBIL BODY
    // ========================================================

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
    // 6. UPDATE DATABASE
    // ========================================================

    const updatedService = await prisma.service.update({
      where: {
        id,
      },
      data: {
        ...(title !== undefined && {
          title,
        }),

        ...(slug !== undefined && {
          slug,
        }),

        ...(description !== undefined && {
          description,
        }),

        ...(icon !== undefined && {
          icon,
        }),

        ...(published !== undefined && {
          published,
        }),

        ...(sortOrder !== undefined && {
          sortOrder: Number(sortOrder) || 0,
        }),
      },
    });

    // ========================================================
    // 7. RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,
      message: "Service berhasil diperbarui.",
      data: updatedService,
    });
  } catch (error) {
    console.error("UPDATE service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal memperbarui service.",
      },
      {
        status: 500,
      }
    );
  }
}

// ============================================================
// DELETE SERVICE
// ============================================================

export async function DELETE(
  _request: NextRequest,
  context: RouteContext
) {
  try {
    // ========================================================
    // 1. CEK SESSION
    // ========================================================

    const session = await auth();

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

    if (role !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          message: "Hanya ADMIN yang dapat menghapus service.",
        },
        {
          status: 403,
        }
      );
    }

    // ========================================================
    // 3. AMBIL ID
    // ========================================================

    const { id } = await context.params;

    // ========================================================
    // 4. CEK SERVICE
    // ========================================================

    const existingService = await prisma.service.findUnique({
      where: {
        id,
      },
    });

    if (!existingService) {
      return NextResponse.json(
        {
          success: false,
          message: "Service tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ========================================================
    // 5. DELETE
    // ========================================================

    await prisma.service.delete({
      where: {
        id,
      },
    });

    // ========================================================
    // 6. RESPONSE
    // ========================================================

    return NextResponse.json({
      success: true,
      message: "Service berhasil dihapus.",
    });
  } catch (error) {
    console.error("DELETE service error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal menghapus service.",
      },
      {
        status: 500,
      }
    );
  }
}