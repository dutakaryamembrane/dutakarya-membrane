"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";

type Service = {
  id: string;
  title: string;
  slug: string;
  description: string;
  icon: string | null;
  published: boolean;
  sortOrder: number;
  createdAt: string;
};

type ApiResponse = {
  success: boolean;
  message?: string;
  data?: Service[];
};

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  // ============================================================
  // LOAD SERVICES
  // ============================================================

  async function loadServices() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch("/api/services", {
        cache: "no-store",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Gagal mengambil data services."
        );
      }

      setServices(result.data || []);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil services."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadServices();
  }, []);

  // ============================================================
  // AUTO SLUG
  // ============================================================

  function handleTitleChange(value: string) {
    setTitle(value);

    const generatedSlug = value
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");

    setSlug(generatedSlug);
  }

  // ============================================================
  // CREATE SERVICE
  // ============================================================

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch("/api/services", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          slug,
          description,
          icon: icon || null,
          published,
          sortOrder: Number(sortOrder) || 0,
        }),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Service gagal dibuat."
        );
      }

      setSuccess("Service berhasil dibuat.");

      // Reset form
      setTitle("");
      setSlug("");
      setDescription("");
      setIcon("");
      setPublished(true);
      setSortOrder("0");

      // Refresh list
      await loadServices();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat service."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
      <div className="mx-auto max-w-7xl">

        {/* ======================================================
            HEADER
        ====================================================== */}

        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">

            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#b8893c]">
                Duta Karya Membrane
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
                Services Management
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Kelola layanan yang ditampilkan pada website Duta
                Karya Membrane.
              </p>
            </div>

            <Link
              href="/admin"
              className="inline-flex w-fit items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:!text-white"
            >
              ← Dashboard
            </Link>

          </div>
        </div>

        {/* ======================================================
            MESSAGE
        ====================================================== */}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            ADD SERVICE
        ====================================================== */}

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
              New Service
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-black">
              Tambah Service
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Tambahkan layanan baru ke database website.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* TITLE + SLUG */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Nama Service
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    handleTitleChange(event.target.value)
                  }
                  placeholder="Contoh: Membrane"
                  required
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Slug
                </label>

                <input
                  type="text"
                  value={slug}
                  onChange={(event) =>
                    setSlug(event.target.value)
                  }
                  placeholder="membrane"
                  required
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  URL-friendly identifier.
                </p>
              </div>

            </div>

            {/* DESCRIPTION */}

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Deskripsi
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                placeholder="Deskripsi layanan..."
                rows={5}
                required
                className="w-full resize-none rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
              />
            </div>

            {/* ICON + SORT ORDER */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Icon
                </label>

                <input
                  type="text"
                  value={icon}
                  onChange={(event) =>
                    setIcon(event.target.value)
                  }
                  placeholder="Opsional"
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Bisa dikosongkan untuk sementara.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Urutan
                </label>

                <input
                  type="number"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value)
                  }
                  min="0"
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Angka lebih kecil akan tampil lebih dahulu.
                </p>
              </div>

            </div>

            {/* PUBLISHED */}

            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-black/10 bg-[#f7f5f0] p-4">

              <input
                type="checkbox"
                checked={published}
                onChange={(event) =>
                  setPublished(event.target.checked)
                }
                className="mt-1 h-4 w-4"
              />

              <span>
                <span className="block text-sm font-medium text-black">
                  Publish service
                </span>

                <span className="mt-1 block text-xs text-gray-500">
                  Service akan tersedia untuk ditampilkan di website.
                </span>
              </span>

            </label>

            {/* BUTTON */}

            <div className="flex justify-end border-t border-black/10 pt-6">

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : "Tambah Service"}
              </button>

            </div>

          </form>

        </section>

        {/* ======================================================
            SERVICE LIST
        ====================================================== */}

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex items-end justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Portfolio Content
              </p>

              <h2 className="mt-3 text-2xl font-semibold text-black">
                Daftar Service
              </h2>
            </div>

            <span className="rounded-full bg-[#f5f3ee] px-4 py-2 text-xs text-gray-600">
              {services.length} service
            </span>

          </div>

          {loading ? (
            <div className="rounded-2xl bg-[#f7f5f0] p-8 text-center text-sm text-gray-500">
              Memuat services...
            </div>
          ) : services.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-black/15 bg-[#f7f5f0] p-10 text-center">

              <p className="text-sm uppercase tracking-[0.2em] text-[#b8893c]">
                Belum Ada Service
              </p>

              <h3 className="mt-3 text-xl font-semibold text-black">
                Database service masih kosong
              </h3>

              <p className="mt-2 text-sm text-gray-500">
                Gunakan form di atas untuk membuat service pertama.
              </p>

            </div>
          ) : (
            <div className="space-y-4">

              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-2xl border border-black/10 p-5 transition hover:border-black/20"
                >

                  <div className="flex flex-col gap-5 md:flex-row md:items-start md:justify-between">

                    <div className="flex gap-4">

                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-[#f5f3ee] text-sm font-semibold text-[#b8893c]">
                        {String(service.sortOrder + 1).padStart(2, "0")}
                      </div>

                      <div>

                        <div className="flex flex-wrap items-center gap-2">

                          <h3 className="text-xl font-semibold text-black">
                            {service.title}
                          </h3>

                          <span
                            className={
                              service.published
                                ? "rounded-full bg-green-100 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-green-700"
                                : "rounded-full bg-gray-100 px-3 py-1 text-[10px] font-medium uppercase tracking-wider text-gray-500"
                            }
                          >
                            {service.published
                              ? "Published"
                              : "Draft"}
                          </span>

                        </div>

                        <p className="mt-1 text-sm text-[#b8893c]">
                          /services/{service.slug}
                        </p>

                        <p className="mt-4 max-w-3xl text-sm leading-6 text-gray-600">
                          {service.description}
                        </p>

                      </div>

                    </div>

                    <div className="shrink-0 text-sm text-gray-500">
                      Order:{" "}
                      <span className="font-medium text-black">
                        {service.sortOrder}
                      </span>
                    </div>

                  </div>

                </article>
              ))}

            </div>
          )}

        </section>

      </div>
    </main>
  );
}