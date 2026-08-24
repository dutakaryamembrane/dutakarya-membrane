"use client";

import { FormEvent, useState } from "react";

export default function ConsultationForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    const form = e.currentTarget;
    const formData = new FormData(form);

    const body = {
      name: formData.get("name"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      company: formData.get("company"),
      service: formData.get("service"),
      message: formData.get("message"),
    };

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Gagal mengirim konsultasi.");
      }

      setSuccess(
        "Konsultasi berhasil dikirim. Tim kami akan menghubungi Anda."
      );

      form.reset();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim konsultasi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#171717]">
            Nama *
          </label>
          <input
            name="name"
            type="text"
            required
            placeholder="Nama lengkap"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#171717]">
            Email *
          </label>
          <input
            name="email"
            type="email"
            required
            placeholder="nama@email.com"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
          />
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div>
          <label className="mb-2 block text-sm font-medium text-[#171717]">
            Nomor Telepon *
          </label>
          <input
            name="phone"
            type="tel"
            required
            placeholder="08xxxxxxxxxx"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-[#171717]">
            Perusahaan
          </label>
          <input
            name="company"
            type="text"
            placeholder="Nama perusahaan"
            className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
          />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#171717]">
          Layanan yang Dibutuhkan *
        </label>

        <select
          name="service"
          required
          defaultValue=""
          className="w-full rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
        >
          <option value="" disabled>
            Pilih layanan
          </option>
          <option value="Membrane">Membrane</option>
          <option value="Kanopi Membrane">Kanopi Membrane</option>
          <option value="Tensile Structure">Tensile Structure</option>
          <option value="Konsultasi Struktur">Konsultasi Struktur</option>
          <option value="Lainnya">Lainnya</option>
        </select>
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-[#171717]">
          Ceritakan Kebutuhan Proyek *
        </label>

        <textarea
          name="message"
          required
          rows={6}
          placeholder="Jelaskan kebutuhan, lokasi proyek, ukuran area, atau informasi lain yang ingin Anda konsultasikan..."
          className="w-full resize-none rounded-xl border border-black/10 bg-white px-4 py-3 text-sm outline-none transition focus:border-[#b8944d]"
        />
      </div>

      {success && (
        <div className="rounded-xl border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700">
          {success}
        </div>
      )}

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={loading}
        className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#b8944d] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {loading ? "Mengirim..." : "Kirim Konsultasi"}
      </button>
    </form>
  );
}