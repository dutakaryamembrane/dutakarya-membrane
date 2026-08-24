"use client";

import { useState } from "react";

type ConsultationStatus =
  | "NEW"
  | "PROCESSING"
  | "COMPLETED";

type Props = {
  consultationId: string;
  initialStatus: string;
};

const STATUS_OPTIONS: {
  value: ConsultationStatus;
  label: string;
  description: string;
}[] = [
  {
    value: "NEW",
    label: "NEW",
    description: "Konsultasi baru masuk",
  },
  {
    value: "PROCESSING",
    label: "PROCESSING",
    description: "Sedang diproses oleh tim",
  },
  {
    value: "COMPLETED",
    label: "COMPLETED",
    description: "Konsultasi selesai",
  },
];

function getStatusStyle(status: string) {
  switch (status) {
    case "PROCESSING":
      return {
        background: "#e8f0f8",
        color: "#315d86",
      };

    case "COMPLETED":
      return {
        background: "#e5f4ea",
        color: "#287044",
      };

    case "NEW":
    default:
      return {
        background: "#f7e9c9",
        color: "#9a6c21",
      };
  }
}

export default function StatusConsultation({
  consultationId,
  initialStatus,
}: Props) {
  const normalizedInitialStatus =
    STATUS_OPTIONS.some(
      (item) => item.value === initialStatus
    )
      ? (initialStatus as ConsultationStatus)
      : "NEW";

  const [status, setStatus] =
    useState<ConsultationStatus>(
      normalizedInitialStatus
    );

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSave() {
    try {
      setSaving(true);
      setSuccess("");
      setError("");

      const response = await fetch(
        `/api/consultations/${consultationId}`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status,
          }),
        }
      );

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message ||
            "Status konsultasi gagal diperbarui."
        );
      }

      setSuccess(
        "Status konsultasi berhasil diperbarui."
      );

      // Refresh halaman agar status header ikut berubah.
      window.setTimeout(() => {
        window.location.reload();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui status."
      );
    } finally {
      setSaving(false);
    }
  }

  const currentStyle = getStatusStyle(status);

  return (
    <div className="rounded-2xl border border-[#e7e4de] bg-[#faf9f6] p-5">
      {/* HEADER */}
      <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div>
          <p className="text-[11px] font-medium uppercase tracking-[0.2em] text-[#8290a5]">
            Status Konsultasi
          </p>

          <p className="mt-1 text-sm text-[#536987]">
            Kelola progres konsultasi dari sini.
          </p>
        </div>

        {/* CURRENT STATUS */}
        <span
          className="inline-flex w-fit rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide"
          style={{
            backgroundColor: currentStyle.background,
            color: currentStyle.color,
          }}
        >
          {status}
        </span>
      </div>

      {/* STATUS OPTIONS */}
      <div className="mt-5 grid gap-3 md:grid-cols-3">
        {STATUS_OPTIONS.map((option) => {
          const active = status === option.value;

          return (
            <button
              key={option.value}
              type="button"
              onClick={() => {
                setStatus(option.value);
                setSuccess("");
                setError("");
              }}
              className="rounded-2xl border p-4 text-left transition"
              style={{
                borderColor: active
                  ? "#b9893f"
                  : "#dedbd5",
                backgroundColor: active
                  ? "#fffaf0"
                  : "#ffffff",
              }}
            >
              <div className="flex items-center justify-between gap-3">
                <span
                  className="text-sm font-semibold"
                  style={{
                    color: active
                      ? "#9a6c21"
                      : "#171717",
                  }}
                >
                  {option.label}
                </span>

                {active && (
                  <span className="text-xs font-semibold text-[#b9893f]">
                    AKTIF
                  </span>
                )}
              </div>

              <p className="mt-2 text-xs leading-5 text-[#536987]">
                {option.description}
              </p>
            </button>
          );
        })}
      </div>

      {/* SAVE BUTTON */}
      <div className="mt-5 flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={handleSave}
          disabled={saving}
          className="inline-flex min-w-[180px] items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold transition hover:bg-[#b9893f] disabled:cursor-not-allowed disabled:opacity-60"
          style={{
            color: "#ffffff",
          }}
        >
          {saving
            ? "Menyimpan..."
            : "Simpan Status"}
        </button>

        {success && (
          <p className="text-sm font-medium text-green-700">
            {success}
          </p>
        )}

        {error && (
          <p className="text-sm font-medium text-red-600">
            {error}
          </p>
        )}
      </div>
    </div>
  );
}