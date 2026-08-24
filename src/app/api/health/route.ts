import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;

    return NextResponse.json({
      success: true,
      status: "healthy",
      database: "connected",
      message: "Duta Karya Membrane API berjalan normal.",
    });
  } catch (error) {
    console.error("HEALTH CHECK DATABASE ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        status: "unhealthy",
        database: "disconnected",
        message: "Database PostgreSQL tidak dapat terhubung.",
      },
      {
        status: 500,
      }
    );
  }
}