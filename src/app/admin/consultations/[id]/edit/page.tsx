"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

type Consultation = {
  id: string;
  name: string;
  email: string;
  phone: string;
  company: string | null;
  service: string;
  message: string;
  status: string;
  createdAt: string;
};

export default function EditConsultationPage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [consultation, setConsultation] =
    useState<Consultation | null>(null);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [service, setService] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState("NEW");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    async function loadConsultation() {
      try {
        setLoading(true);
        setError("");

        const response = await fetch(`/api/consultations/${id}`);

        if (!response.ok) {
          throw new Error("Konsultasi tidak ditemukan.");
        }

        const data = await response.json();

        const item = data.data;

        setConsultation(item);

        setName(item.name || "");
        setEmail(item.email || "");
        setPhone(item.phone || "");
        setCompany(item.company || "");
        setService(item.service || "");
        setMessage(item.message || "");
        setStatus(item.status || "NEW");
      } catch (err) {
        console.error(err);

        setError(
          err instanceof Error
            ? err.message
            : "Gagal memuat data konsultasi."
        );
      } finally {
        setLoading(false);
      }
    }

    if (id) {
      loadConsultation();
    }
  }, [id]);

  async function handleSubmit(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");

      const response = await fetch(`/api/consultations/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          email,
          phone,
          company,
          service,
          message,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Gagal menyimpan perubahan."
        );
      }

      router.push(`/admin/consultations/${id}`);
      router.refresh();
    } catch (err) {
      console.error(err);

      setError(
        err instanceof Error
          ? err.message
          : "Gagal menyimpan perubahan."
      );
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1000px]">
          <div className="rounded-[24px] border border-black/10 bg-white p-8 shadow-sm">
            <p className="text-sm text-[#49617a]">
              Memuat data konsultasi...
            </p>
          </div>
        </div>
      </main>
    );
  }

  if (!consultation) {
    return (
      <main className="min-h-screen bg-[#f7f5f0] px-5 py-10 md:px-10">
        <div className="mx-auto max-w-[1000px]">
          <div className="rounded-[24px] border border-black/10 bg-white p-8 shadow-sm">
            <p className="mb-4 text-red-600">
              {error || "Data konsultasi tidak ditemukan."}
            </p>

            <Link
              href="/admin/consultations"
              className="text-sm text-[#123b68] hover:underline"
            >
              ← Kembali ke Konsultasi
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-5 py-10 md:px-10">
      <div className="mx-auto max-w-[1000px]">

        {/* BACK */}
        <div className="mb-8">
          <Link
            href={`/admin/consultations/${id}`}
            className="text-sm text-[#123b68] transition hover:underline"
          >
            ← Kembali ke Detail Konsultasi
          </Link>
        </div>

        {/* HEADER */}
        <div className="mb-8">
          <p className="mb-2 text-[11px] font-medium uppercase tracking-[0.35em] text-[#b88735]">
            Edit Konsultasi
          </p>

          <h1 className="text-3xl font-bold tracking-tight text-[#071a2b] md:text-4xl">
            Edit Data Konsultasi
          </h1>

          <p className="mt-2 text-sm text-[#49617a]">
            Perbarui informasi konsultasi yang masuk dari website.
          </p>
        </div>

        {/* FORM CARD */}
        <form
          onSubmit={handleSubmit}
          className="overflow-hidden rounded-[24px] border border-black/10 bg-white shadow-sm"
        >

          {/* INFORMASI KONTAK */}
          <section className="p-7 md:p-8">
            <h2 className="mb-8 text-lg font-semibold text-[#101820]">
              Informasi Kontak
            </h2>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

              {/* NAMA */}
              <div>
                <label
                  htmlFor="name"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Nama <span className="text-red-500">*</span>
                </label>

                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(event) =>
                    setName(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                  placeholder="Nama lengkap"
                />
              </div>

              {/* EMAIL */}
              <div>
                <label
                  htmlFor="email"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Email <span className="text-red-500">*</span>
                </label>

                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(event) =>
                    setEmail(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                  placeholder="nama@email.com"
                />
              </div>

              {/* PHONE */}
              <div>
                <label
                  htmlFor="phone"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  WhatsApp / Telepon{" "}
                  <span className="text-red-500">*</span>
                </label>

                <input
                  id="phone"
                  type="text"
                  value={phone}
                  onChange={(event) =>
                    setPhone(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                  placeholder="08xxxxxxxxxx"
                />
              </div>

              {/* COMPANY */}
              <div>
                <label
                  htmlFor="company"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Perusahaan
                </label>

                <input
                  id="company"
                  type="text"
                  value={company}
                  onChange={(event) =>
                    setCompany(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                  placeholder="Nama perusahaan"
                />
              </div>

              {/* SERVICE */}
              <div className="md:col-span-2">
                <label
                  htmlFor="service"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Kebutuhan Layanan{" "}
                  <span className="text-red-500">*</span>
                </label>

                <select
                  id="service"
                  value={service}
                  onChange={(event) =>
                    setService(event.target.value)
                  }
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                >
                  <option value="">Pilih layanan</option>
                  <option value="Membrane">Membrane</option>
                  <option value="Tensile">Tensile</option>
                  <option value="Canopy">Canopy</option>
                  <option value="Steel">Steel</option>
                  <option value="Lainnya">Lainnya</option>
                </select>
              </div>

              {/* MESSAGE */}
              <div className="md:col-span-2">
                <label
                  htmlFor="message"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Detail Kebutuhan{" "}
                  <span className="text-red-500">*</span>
                </label>

                <textarea
                  id="message"
                  value={message}
                  onChange={(event) =>
                    setMessage(event.target.value)
                  }
                  required
                  rows={7}
                  className="w-full resize-y rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm leading-6 text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20"
                  placeholder="Jelaskan kebutuhan proyek Anda..."
                />
              </div>

              {/* STATUS */}
              <div className="md:col-span-2">
                <label
                  htmlFor="status"
                  className="mb-2 block text-xs font-medium text-[#123b68]"
                >
                  Status
                </label>

                <select
                  id="status"
                  value={status}
                  onChange={(event) =>
                    setStatus(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/10 bg-[#faf9f6] px-4 py-3 text-sm text-[#101820] outline-none transition focus:border-[#b88735] focus:ring-2 focus:ring-[#b88735]/20 md:max-w-[400px]"
                >
                  <option value="NEW">NEW</option>
                  <option value="COMPLETED">
                    COMPLETED
                  </option>
                </select>
              </div>
            </div>
          </section>

          {/* ERROR */}
          {error && (
            <div className="border-t border-black/10 px-7 py-5 md:px-8">
              <div className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">
                {error}
              </div>
            </div>
          )}

          {/* ACTION */}
          <section className="flex flex-wrap items-center gap-3 border-t border-black/10 p-7 md:p-8">

            {/* SAVE */}
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center justify-center rounded-full bg-[#b88735] px-7 py-3 text-sm font-semibold text-white transition hover:bg-[#9f742c] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {saving
                ? "Menyimpan..."
                : "Simpan Perubahan"}
            </button>

            {/* CANCEL */}
            <Link
              href={`/admin/consultations/${id}`}
              className="inline-flex items-center justify-center rounded-full border border-[#181818] bg-white px-7 py-3 text-sm font-semibold text-[#181818] transition hover:bg-[#181818] hover:text-white"
            >
              Batal
            </Link>

            {/* BACK TO LIST */}
            <Link
              href="/admin/consultations"
              className="inline-flex items-center justify-center rounded-full border border-[#d5dce3] bg-white px-7 py-3 text-sm font-medium text-[#49617a] transition hover:border-[#123b68] hover:text-[#123b68]"
            >
              Daftar Konsultasi
            </Link>
          </section>
        </form>
      </div>
    </main>
  );
}