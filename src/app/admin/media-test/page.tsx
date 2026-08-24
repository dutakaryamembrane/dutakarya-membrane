"use client";

import { ChangeEvent, useState } from "react";

type UploadResult = {
  success: boolean;
  message?: string;
  data?: {
    id: string;
    url: string;
    publicId: string;
    filename: string;
    mimeType: string;
    size: number;
    width: number | null;
    height: number | null;
  };
  error?: string;
};

export default function MediaTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState<UploadResult | null>(null);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const selectedFile = event.target.files?.[0];

    setResult(null);

    if (!selectedFile) {
      setFile(null);
      setPreview(null);
      return;
    }

    setFile(selectedFile);

    const previewUrl = URL.createObjectURL(selectedFile);
    setPreview(previewUrl);
  }

  async function handleUpload() {
    if (!file) {
      setResult({
        success: false,
        message: "Silakan pilih gambar terlebih dahulu.",
      });

      return;
    }

    try {
      setUploading(true);
      setResult(null);

      const formData = new FormData();

      formData.append("file", file);

      const response = await fetch("/api/media", {
        method: "POST",
        body: formData,
      });

      const data: UploadResult = await response.json();

      setResult(data);

      if (!response.ok) {
        return;
      }

      setFile(null);
      setPreview(null);
    } catch (error) {
      console.error(error);

      setResult({
        success: false,
        message: "Terjadi kesalahan saat mengupload gambar.",
      });
    } finally {
      setUploading(false);
    }
  }

  return (
    <main
      style={{
        minHeight: "100vh",
        background: "#f5f3ee",
        padding: "60px 20px",
      }}
    >
      <div
        style={{
          maxWidth: "800px",
          margin: "0 auto",
        }}
      >
        <section
          style={{
            background: "#ffffff",
            borderRadius: "20px",
            padding: "40px",
            boxShadow: "0 4px 20px rgba(0,0,0,0.06)",
          }}
        >
          <div
            style={{
              fontSize: "12px",
              letterSpacing: "4px",
              color: "#b77d32",
              marginBottom: "12px",
            }}
          >
            DUTA KARYA MEMBRANE
          </div>

          <h1
            style={{
              fontSize: "36px",
              margin: "0 0 10px",
              color: "#111111",
            }}
          >
            Media Upload Test
          </h1>

          <p
            style={{
              color: "#52627a",
              marginBottom: "30px",
            }}
          >
            Test upload gambar ke Cloudinary dan database.
          </p>

          <div
            style={{
              border: "1px dashed #c9c9c9",
              borderRadius: "16px",
              padding: "30px",
              marginBottom: "25px",
            }}
          >
            <label
              style={{
                display: "block",
                fontWeight: 600,
                marginBottom: "10px",
              }}
            >
              Pilih Gambar
            </label>

            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={handleFileChange}
            />

            <p
              style={{
                fontSize: "13px",
                color: "#777",
                marginTop: "10px",
              }}
            >
              Format: JPG, PNG, WEBP, AVIF — maksimal 10 MB.
            </p>
          </div>

          {preview && (
            <div
              style={{
                marginBottom: "25px",
              }}
            >
              <p
                style={{
                  fontWeight: 600,
                  marginBottom: "10px",
                }}
              >
                Preview
              </p>

              <img
                src={preview}
                alt="Preview"
                style={{
                  width: "100%",
                  maxHeight: "450px",
                  objectFit: "contain",
                  borderRadius: "14px",
                  background: "#f1f1f1",
                }}
              />
            </div>
          )}

          {file && (
            <div
              style={{
                background: "#f7f7f5",
                borderRadius: "12px",
                padding: "15px",
                marginBottom: "20px",
                fontSize: "14px",
              }}
            >
              <strong>File:</strong> {file.name}
              <br />
              <strong>Type:</strong> {file.type}
              <br />
              <strong>Size:</strong>{" "}
              {(file.size / 1024 / 1024).toFixed(2)} MB
            </div>
          )}

          <button
            type="button"
            onClick={handleUpload}
            disabled={!file || uploading}
            style={{
              width: "100%",
              border: "none",
              borderRadius: "12px",
              padding: "15px 20px",
              background: !file || uploading ? "#cccccc" : "#171717",
              color: "#ffffff",
              fontWeight: 600,
              cursor: !file || uploading ? "not-allowed" : "pointer",
            }}
          >
            {uploading ? "Mengupload..." : "Upload Gambar"}
          </button>

          {result && (
            <div
              style={{
                marginTop: "25px",
                padding: "20px",
                borderRadius: "14px",
                background: result.success ? "#ecfdf3" : "#fff1f1",
                border: `1px solid ${
                  result.success ? "#a7e3c1" : "#ffc5c5"
                }`,
              }}
            >
              <strong>
                {result.success ? "Upload berhasil!" : "Upload gagal"}
              </strong>

              <p
                style={{
                  marginTop: "8px",
                  marginBottom: "15px",
                }}
              >
                {result.message}
              </p>

              {result.data && (
                <>
                  <div
                    style={{
                      fontSize: "13px",
                      lineHeight: 1.8,
                      wordBreak: "break-word",
                    }}
                  >
                    <strong>Media ID:</strong> {result.data.id}
                    <br />

                    <strong>Public ID:</strong> {result.data.publicId}
                    <br />

                    <strong>Filename:</strong> {result.data.filename}
                    <br />

                    <strong>Dimensions:</strong>{" "}
                    {result.data.width ?? "-"} ×{" "}
                    {result.data.height ?? "-"}
                    <br />

                    <strong>URL:</strong>{" "}
                    <a
                      href={result.data.url}
                      target="_blank"
                      rel="noreferrer"
                    >
                      {result.data.url}
                    </a>
                  </div>

                  <img
                    src={result.data.url}
                    alt={result.data.filename}
                    style={{
                      width: "100%",
                      maxHeight: "400px",
                      objectFit: "contain",
                      marginTop: "20px",
                      borderRadius: "12px",
                      background: "#ffffff",
                    }}
                  />
                </>
              )}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}