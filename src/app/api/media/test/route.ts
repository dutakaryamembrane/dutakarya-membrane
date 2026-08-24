import { NextResponse } from "next/server";
import { cloudinary } from "@/lib/storage";

export async function GET() {
  try {
    const result = await cloudinary.api.ping();

    return NextResponse.json({
      success: true,
      message: "Cloudinary berhasil terhubung.",
      result,
    });
  } catch (error) {
    console.error("Cloudinary connection error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary gagal terhubung.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown Cloudinary error",
      },
      { status: 500 }
    );
  }
}