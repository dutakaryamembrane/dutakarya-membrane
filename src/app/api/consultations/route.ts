import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

// ============================================================
// POST — CREATE CONSULTATION
// ============================================================

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    const {
      name,
      email,
      phone,
      company,
      service,
      message,
    } = body;

    // ========================================================
    // VALIDATION
    // ========================================================

    if (typeof name !== "string" || !name.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Nama wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (typeof email !== "string" || !email.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Email wajib diisi.",
        },
        { status: 400 }
      );
    }

    if (typeof message !== "string" || !message.trim()) {
      return NextResponse.json(
        {
          success: false,
          message: "Pesan konsultasi wajib diisi.",
        },
        { status: 400 }
      );
    }

    // ========================================================
    // CREATE CONSULTATION
    // ========================================================

    const consultation = await prisma.consultation.create({
      data: {
        name: name.trim(),

        email: email.trim(),

        phone:
          typeof phone === "string" && phone.trim()
            ? phone.trim()
            : null,

        company:
          typeof company === "string" && company.trim()
            ? company.trim()
            : null,

        service:
          typeof service === "string" && service.trim()
            ? service.trim()
            : null,

        message: message.trim(),

        status: "NEW",
      },
    });

    // ========================================================
    // RESPONSE
    // ========================================================

    return NextResponse.json(
      {
        success: true,
        message: "Konsultasi berhasil dikirim.",
        data: consultation,
      },
      {
        status: 201,
      }
    );
  } catch (error) {
    console.error("POST consultation error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengirim konsultasi.",
      },
      {
        status: 500,
      }
    );
  }
}