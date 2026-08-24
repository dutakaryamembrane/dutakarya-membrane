import { NextRequest, NextResponse } from "next/server";
import { cloudinary } from "@/lib/storage";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10 MB

const ALLOWED_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/avif",
];

export async function POST(request: NextRequest) {
  try {
    // =========================================================
    // 1. Ambil multipart/form-data
    // =========================================================

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        {
          success: false,
          message: "File gambar tidak ditemukan.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 2. Validasi tipe file
    // =========================================================

    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Format file tidak didukung. Gunakan JPG, PNG, WEBP, atau AVIF.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 3. Validasi ukuran file
    // =========================================================

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: "Ukuran file terlalu besar. Maksimal 10 MB.",
        },
        { status: 400 }
      );
    }

    // =========================================================
    // 4. Convert File → Buffer
    // =========================================================

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // =========================================================
    // 5. Upload ke Cloudinary
    // =========================================================

    const uploadResult = await new Promise<{
      secure_url: string;
      public_id: string;
      original_filename?: string;
      resource_type?: string;
      format?: string;
      bytes?: number;
      width?: number;
      height?: number;
    }>((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          folder: "duta-karya-membrane",
          resource_type: "image",
        },
        (error, result) => {
          if (error) {
            reject(error);
            return;
          }

          if (!result) {
            reject(
              new Error("Cloudinary tidak mengembalikan hasil upload.")
            );
            return;
          }

          resolve({
            secure_url: result.secure_url,
            public_id: result.public_id,
            original_filename: result.original_filename,
            resource_type: result.resource_type,
            format: result.format,
            bytes: result.bytes,
            width: result.width,
            height: result.height,
          });
        }
      );

      uploadStream.end(buffer);
    });

    // =========================================================
    // 6. Simpan metadata ke database
    // =========================================================

    const media = await prisma.media.create({
      data: {
        // WAJIB sesuai schema Prisma
        type: "IMAGE",

        // source mempunyai default UPLOAD,
        // jadi sebenarnya boleh tidak ditulis.
        // Kita tulis eksplisit supaya jelas.
        source: "UPLOAD",

        url: uploadResult.secure_url,
        publicId: uploadResult.public_id,
        filename: file.name,
        mimeType: file.type,
        size: file.size,
        width: uploadResult.width ?? null,
        height: uploadResult.height ?? null,
      },
    });

    // =========================================================
    // 7. Response
    // =========================================================

    return NextResponse.json(
      {
        success: true,
        message: "Gambar berhasil diupload.",
        data: {
          id: media.id,
          type: media.type,
          source: media.source,
          url: media.url,
          publicId: media.publicId,
          filename: media.filename,
          mimeType: media.mimeType,
          size: media.size,
          width: media.width,
          height: media.height,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Media upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Gagal mengupload gambar.",
        error:
          error instanceof Error
            ? error.message
            : "Unknown media upload error",
      },
      { status: 500 }
    );
  }
}