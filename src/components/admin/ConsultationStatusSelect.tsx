"use client";

import { useState } from "react";

type ConsultationStatus =
  | "NEW"
  | "PROCESSING"
  | "COMPLETED";

interface ConsultationStatusSelectProps {
  id: string;
  status: ConsultationStatus;
}

export default function ConsultationStatusSelect({
  id,
  status,
}: ConsultationStatusSelectProps) {
  const [currentStatus, setCurrentStatus] =
    useState<ConsultationStatus>(status);

  const [loading, setLoading] =
    useState(false);

  const [success, setSuccess] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleChange(
    event: React.ChangeEvent<HTMLSelectElement>
  ) {
    const newStatus =
      event.target.value as ConsultationStatus;

    if (newStatus === currentStatus) {
      return;
    }

    const previousStatus = currentStatus;

    setLoading(true);
    setSuccess(false);
    setError("");

    // Optimistic update
    setCurrentStatus(newStatus);

    try {
      const response = await fetch(
        `/api/consultations/${id}`,
        {
          method: "PATCH",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const result =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Gagal mengubah status konsultasi."
        );
      }

      // Gunakan status dari database sebagai
      // sumber kebenaran.
      if (
        result.data?.status
      ) {
        setCurrentStatus(
          result.data.status
        );
      }

      setSuccess(true);

      // Hilangkan indikator berhasil
      // setelah beberapa detik.
      window.setTimeout(() => {
        setSuccess(false);
      }, 2000);
    } catch (error) {
      console.error(
        "Gagal mengubah status konsultasi:",
        error
      );

      // Kembalikan status sebelumnya
      // jika database gagal di-update.
      setCurrentStatus(
        previousStatus
      );

      setError(
        error instanceof Error
          ? error.message
          : "Gagal mengubah status konsultasi."
      );

      window.setTimeout(() => {
        setError("");
      }, 3000);
    } finally {
      setLoading(false);
    }
  }

  const statusClass =
    currentStatus === "NEW"
      ? "border-[#ead8b2] bg-[#f8edcf] text-[#8a6118]"
      : currentStatus === "PROCESSING"
        ? "border-[#c9d8ec] bg-[#eaf1fa] text-[#315b8a]"
        : "border-[#c9dfd0] bg-[#eaf5ec] text-[#2f6b42]";

  return (
    <div className="relative inline-flex flex-col items-start gap-1">
      <select
        value={currentStatus}
        onChange={handleChange}
        disabled={loading}
        aria-label={`Status konsultasi ${id}`}
        className={`
          rounded-full
          border
          px-3
          py-1.5
          text-xs
          font-medium
          outline-none
          transition
          ${statusClass}
          ${
            loading
              ? "cursor-wait opacity-60"
              : "cursor-pointer"
          }
        `}
      >
        <option value="NEW">
          NEW
        </option>

        <option value="PROCESSING">
          PROCESSING
        </option>

        <option value="COMPLETED">
          COMPLETED
        </option>
      </select>

      {loading && (
        <span className="text-[10px] text-gray-400">
          Menyimpan...
        </span>
      )}

      {success && !loading && (
        <span className="text-[10px] font-medium text-[#3d7a4c]">
          Tersimpan
        </span>
      )}

      {error && (
        <span className="max-w-[180px] text-[10px] font-medium text-red-600">
          {error}
        </span>
      )}
    </div>
  );
}