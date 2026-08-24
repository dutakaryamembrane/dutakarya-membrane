import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { auth } from "@/lib/auth";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

const ALLOWED_STATUSES = [
  "NEW",
  "PROCESSING",
  "COMPLETED",
] as const;

type ConsultationStatus =
  (typeof ALLOWED_STATUSES)[number];

export async function PATCH(
  request: NextRequest,
  context: RouteContext
) {
  try {
    // ============================================================
    // 1. CEK SESSION
    // ============================================================

    const session = await auth();

    if (!session?.user) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Unauthorized. Silakan login terlebih dahulu.",
        },
        {
          status: 401,
        }
      );
    }

    // ============================================================
    // 2. CEK ROLE
    // ============================================================

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

    // ============================================================
    // 3. AMBIL ID
    // ============================================================

    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          message: "ID konsultasi tidak ditemukan.",
        },
        {
          status: 400,
        }
      );
    }

    // ============================================================
    // 4. CEK KONSULTASI
    // ============================================================

    const consultation =
      await prisma.consultation.findUnique({
        where: {
          id,
        },
      });

    if (!consultation) {
      return NextResponse.json(
        {
          success: false,
          message: "Konsultasi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ============================================================
    // 5. AMBIL BODY
    // ============================================================

    const body = await request.json();

    const requestedStatus = body?.status;

    // ============================================================
    // 6. VALIDASI STATUS
    // ============================================================

    if (
      typeof requestedStatus !== "string" ||
      !ALLOWED_STATUSES.includes(
        requestedStatus as ConsultationStatus
      )
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Status tidak valid. Gunakan NEW, PROCESSING, atau COMPLETED.",
        },
        {
          status: 400,
        }
      );
    }

    const status =
      requestedStatus as ConsultationStatus;

    // ============================================================
    // 7. UPDATE DATABASE
    // ============================================================

    const updatedConsultation =
      await prisma.consultation.update({
        where: {
          id,
        },
        data: {
          /*
           * Menggunakan casting agar tetap kompatibel
           * jika Prisma schema menggunakan String maupun Enum.
           */
          status: status as any,
        },
      });

    // ============================================================
    // 8. RESPONSE
    // ============================================================

    return NextResponse.json({
      success: true,
      message:
        "Status konsultasi berhasil diperbarui.",
      data: updatedConsultation,
    });
  } catch (error) {
    console.error(
      "PATCH consultation status error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          "Gagal memperbarui status konsultasi.",
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