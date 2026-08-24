"use client";

import { useState } from "react";

type ConsultationStatus =
  | "NEW"
  | "PROCESSING"
  | "COMPLETED";

type ConsultationStatusControlProps = {
  consultationId: string;
  initialStatus: string;
};

const STATUS_OPTIONS: ConsultationStatus[] = [
  "NEW",
  "PROCESSING",
  "COMPLETED",
];

export default function ConsultationStatusControl({
  consultationId,
  initialStatus,
}: ConsultationStatusControlProps) {
  const normalizedInitialStatus =
    STATUS_OPTIONS.includes(
      initialStatus as ConsultationStatus
    )
      ? (initialStatus as ConsultationStatus)
      : "NEW";

  const [status, setStatus] =
    useState<ConsultationStatus>(
      normalizedInitialStatus
    );

  const [saving, setSaving] =
    useState(false);

  const [error, setError] =
    useState("");

  async function handleChange(
    newStatus: ConsultationStatus
  ) {
    if (
      newStatus === status ||
      saving
    ) {
      return;
    }

    const previousStatus = status;

    // Update UI terlebih dahulu
    setStatus(newStatus);
    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/consultations/${consultationId}`,
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
          result.error ||
            result.message ||
            "Status gagal diperbarui."
        );
      }

      // Gunakan status dari database
      if (
        result.data?.status &&
        STATUS_OPTIONS.includes(
          result.data.status
        )
      ) {
        setStatus(
          result.data.status as ConsultationStatus
        );
      }
    } catch (error) {
      // Kembalikan status sebelumnya
      setStatus(previousStatus);

      setError(
        error instanceof Error
          ? error.message
          : "Gagal memperbarui status."
      );
    } finally {
      setSaving(false);
    }
  }

  function getStatusClass(
    currentStatus: ConsultationStatus
  ) {
    switch (currentStatus) {
      case "NEW":
        return "border-[#e7d7b5] bg-[#fffaf0] text-[#9a712c]";

      case "PROCESSING":
        return "border-[#cbdcf4] bg-[#f3f8ff] text-[#35679d]";

      case "COMPLETED":
        return "border-[#c9e4d2] bg-[#f2fbf5] text-[#34734a]";

      default:
        return "border-gray-200 bg-white text-gray-700";
    }
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <select
        value={status}
        disabled={saving}
        onChange={(event) =>
          handleChange(
            event.target.value as ConsultationStatus
          )
        }
        className={`min-w-[120px] cursor-pointer rounded-lg border px-3 py-2 text-sm font-medium outline-none transition focus:ring-2 focus:ring-[#b98f3f]/30 disabled:cursor-wait disabled:opacity-60 ${getStatusClass(
          status
        )}`}
        aria-label="Status konsultasi"
      >
        {STATUS_OPTIONS.map(
          (option) => (
            <option
              key={option}
              value={option}
            >
              {option}
            </option>
          )
        )}
      </select>

      {saving && (
        <span className="text-[11px] text-gray-400">
          Menyimpan...
        </span>
      )}

      {error && (
        <span className="max-w-[180px] text-[11px] leading-4 text-red-500">
          {error}
        </span>
      )}
    </div>
  );
}