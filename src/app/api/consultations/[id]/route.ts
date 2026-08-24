import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

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

/**
 * GET
 * Mengambil satu data konsultasi
 */
export async function GET(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

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
          error: "Konsultasi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    return NextResponse.json({
      success: true,
      data: consultation,
    });
  } catch (error) {
    console.error(
      "GET /api/consultations/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error: "Gagal mengambil data konsultasi.",
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * PATCH
 *
 * Bisa digunakan untuk:
 *
 * 1. Mengubah STATUS saja
 * 2. Mengubah seluruh data konsultasi
 *
 * Status:
 * NEW
 * PROCESSING
 * COMPLETED
 */
export async function PATCH(
  request: Request,
  context: RouteContext
) {
  try {
    const { id } = await context.params;

    // ==========================================================
    // 1. CEK ID
    // ==========================================================

    if (!id) {
      return NextResponse.json(
        {
          success: false,
          error: "ID konsultasi wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================================
    // 2. CARI KONSULTASI
    // ==========================================================

    const existingConsultation =
      await prisma.consultation.findUnique({
        where: {
          id,
        },
      });

    if (!existingConsultation) {
      return NextResponse.json(
        {
          success: false,
          error: "Konsultasi tidak ditemukan.",
        },
        {
          status: 404,
        }
      );
    }

    // ==========================================================
    // 3. BACA BODY
    // ==========================================================

    const body = await request.json();

    // ==========================================================
    // 4. UPDATE STATUS SAJA
    //
    // Digunakan oleh:
    // ConsultationStatusControl
    //
    // Contoh body:
    //
    // {
    //   "status": "PROCESSING"
    // }
    // ==========================================================

    if (
      typeof body.status === "string" &&
      Object.keys(body).length === 1
    ) {
      const status = body.status.trim().toUpperCase();

      if (
        !ALLOWED_STATUSES.includes(
          status as (typeof ALLOWED_STATUSES)[number]
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Status konsultasi tidak valid. Gunakan NEW, PROCESSING, atau COMPLETED.",
          },
          {
            status: 400,
          }
        );
      }

      const updatedConsultation =
        await prisma.consultation.update({
          where: {
            id,
          },
          data: {
            status,
          },
        });

      return NextResponse.json({
        success: true,
        message:
          "Status konsultasi berhasil diperbarui.",
        data: updatedConsultation,
      });
    }

    // ==========================================================
    // 5. FULL UPDATE KONSULTASI
    //
    // Digunakan oleh halaman Edit Konsultasi
    // ==========================================================

    const {
      name,
      email,
      phone,
      company,
      service,
      message,
      status,
    } = body;

    // ==========================================================
    // 6. VALIDASI DATA UTAMA
    // ==========================================================

    if (
      typeof name !== "string" ||
      name.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Nama wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof email !== "string" ||
      email.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Email wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof phone !== "string" ||
      phone.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Nomor telepon wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof service !== "string" ||
      service.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Layanan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    if (
      typeof message !== "string" ||
      message.trim() === ""
    ) {
      return NextResponse.json(
        {
          success: false,
          error: "Detail kebutuhan wajib diisi.",
        },
        {
          status: 400,
        }
      );
    }

    // ==========================================================
    // 7. VALIDASI STATUS
    // ==========================================================

    let finalStatus =
      existingConsultation.status;

    if (typeof status === "string") {
      finalStatus = status.trim().toUpperCase();

      if (
        !ALLOWED_STATUSES.includes(
          finalStatus as (typeof ALLOWED_STATUSES)[number]
        )
      ) {
        return NextResponse.json(
          {
            success: false,
            error:
              "Status konsultasi tidak valid. Gunakan NEW, PROCESSING, atau COMPLETED.",
          },
          {
            status: 400,
          }
        );
      }
    }

    // ==========================================================
    // 8. UPDATE DATABASE
    // ==========================================================

    const updatedConsultation =
      await prisma.consultation.update({
        where: {
          id,
        },
        data: {
          name: name.trim(),

          email: email.trim(),

          phone: phone.trim(),

          company:
            typeof company === "string" &&
            company.trim() !== ""
              ? company.trim()
              : null,

          service: service.trim(),

          message: message.trim(),

          status: finalStatus,
        },
      });

    // ==========================================================
    // 9. RESPONSE
    // ==========================================================

    return NextResponse.json({
      success: true,
      message:
        "Konsultasi berhasil diperbarui.",
      data: updatedConsultation,
    });
  } catch (error) {
    console.error(
      "PATCH /api/consultations/[id] error:",
      error
    );

    return NextResponse.json(
      {
        success: false,
        error:
          error instanceof Error
            ? error.message
            : "Gagal memperbarui konsultasi.",
      },
      {
        status: 500,
      }
    );
  }
}