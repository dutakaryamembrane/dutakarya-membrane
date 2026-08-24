"use client";

import { FormEvent, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

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
  data?: Service;
};

export default function EditServicePage() {
  const params = useParams();
  const router = useRouter();

  const id = params.id as string;

  const [service, setService] = useState<Service | null>(null);

  const [title, setTitle] = useState("");
  const [slug, setSlug] = useState("");
  const [description, setDescription] = useState("");
  const [icon, setIcon] = useState("");
  const [published, setPublished] = useState(true);
  const [sortOrder, setSortOrder] = useState("0");

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // ============================================================
  // LOAD SERVICE
  // ============================================================

  async function loadService() {
    try {
      setLoading(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/services/${id}`, {
        cache: "no-store",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success || !result.data) {
        throw new Error(
          result.message || "Gagal mengambil detail service."
        );
      }

      const data = result.data;

      setService(data);

      setTitle(data.title);
      setSlug(data.slug);
      setDescription(data.description);
      setIcon(data.icon || "");
      setPublished(data.published);
      setSortOrder(String(data.sortOrder));
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil service."
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (id) {
      loadService();
    }
  }, [id]);

  // ============================================================
  // UPDATE SERVICE
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    try {
      setSaving(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/services/${id}`, {
        method: "PUT",
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

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Service gagal diperbarui."
        );
      }

      if (result.data) {
        setService(result.data);
      }

      setSuccess("Service berhasil diperbarui.");

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat memperbarui service."
      );
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // DELETE SERVICE
  // ============================================================

  async function handleDelete() {
    const confirmed = window.confirm(
      `Apakah kamu yakin ingin menghapus service "${title}"?\n\nData service akan dihapus dari database.`
    );

    if (!confirmed) {
      return;
    }

    try {
      setDeleting(true);
      setError("");
      setSuccess("");

      const response = await fetch(`/api/services/${id}`, {
        method: "DELETE",
      });

      const result: ApiResponse = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Service gagal dihapus."
        );
      }

      router.push("/admin/services");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menghapus service."
      );
    } finally {
      setDeleting(false);
    }
  }

  // ============================================================
  // LOADING
  // ============================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm text-gray-500">
              Memuat detail service...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ============================================================
  // ERROR / SERVICE NOT FOUND
  // ============================================================

  if (!service) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-7xl">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
              Service
            </p>

            <h1 className="mt-3 text-3xl font-semibold text-black">
              Service tidak ditemukan
            </h1>

            <p className="mt-3 text-gray-600">
              {error ||
                "Service yang ingin kamu edit tidak tersedia."}
            </p>

            <Link
              href="/admin/services"
              className="mt-6 inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c]"
            >
              ← Kembali ke Services
            </Link>
          </div>
        </div>
      </main>
    );
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
                Edit Service
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Perbarui informasi layanan yang digunakan pada
                website Duta Karya Membrane.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">

              <Link
                href="/admin/services"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:!text-white"
              >
                ← Services
              </Link>

              <Link
                href={`/services/${service.slug}`}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c]"
              >
                Lihat Website →
              </Link>

            </div>
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
            SERVICE INFORMATION
        ====================================================== */}

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
              Service Information
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-black">
              Informasi Service
            </h2>

            <p className="mt-2 text-sm text-gray-600">
              Perbarui nama, URL, deskripsi, dan informasi
              publikasi service.
            </p>
          </div>

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >

            {/* ==================================================
                TITLE + SLUG
            ================================================== */}

            <div className="grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Nama Service
                </label>

                <input
                  type="text"
                  value={title}
                  onChange={(event) =>
                    setTitle(event.target.value)
                  }
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
                  required
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  URL service: /services/{slug}
                </p>
              </div>

            </div>

            {/* ==================================================
                DESCRIPTION
            ================================================== */}

            <div>
              <label className="mb-2 block text-sm font-medium text-black">
                Deskripsi
              </label>

              <textarea
                value={description}
                onChange={(event) =>
                  setDescription(event.target.value)
                }
                required
                rows={6}
                className="w-full resize-none rounded-xl border border-black/15 px-4 py-3 text-sm leading-6 text-black outline-none transition focus:border-[#b8893c]"
              />
            </div>

            {/* ==================================================
                ICON + SORT ORDER
            ================================================== */}

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
                  Bisa dikosongkan jika belum menggunakan icon.
                </p>
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium text-black">
                  Urutan
                </label>

                <input
                  type="number"
                  min="0"
                  value={sortOrder}
                  onChange={(event) =>
                    setSortOrder(event.target.value)
                  }
                  className="w-full rounded-xl border border-black/15 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Angka lebih kecil akan tampil lebih dahulu.
                </p>
              </div>

            </div>

            {/* ==================================================
                PUBLISHED
            ================================================== */}

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
                  Service akan tersedia untuk ditampilkan
                  pada website publik.
                </span>
              </span>

            </label>

            {/* ==================================================
                SAVE
            ================================================== */}

            <div className="flex flex-col gap-3 border-t border-black/10 pt-6 sm:flex-row sm:justify-end">

              <Link
                href="/admin/services"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-7 py-3 text-sm font-medium text-black transition hover:bg-black hover:!text-white"
              >
                Batal
              </Link>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Perubahan"}
              </button>

            </div>

          </form>
        </section>

        {/* ======================================================
            SERVICE STATUS
        ====================================================== */}

        <section className="mb-8 rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6">
            <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
              Service Status
            </p>

            <h2 className="mt-3 text-2xl font-semibold text-black">
              Status Service
            </h2>
          </div>

          <div className="grid gap-5 md:grid-cols-3">

            <div className="rounded-2xl border border-black/10 bg-[#f7f5f0] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Status
              </p>

              <p
                className={
                  published
                    ? "mt-2 text-lg font-semibold text-green-700"
                    : "mt-2 text-lg font-semibold text-gray-500"
                }
              >
                {published ? "Published" : "Draft"}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-[#f7f5f0] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                Urutan
              </p>

              <p className="mt-2 text-lg font-semibold text-black">
                {sortOrder}
              </p>
            </div>

            <div className="rounded-2xl border border-black/10 bg-[#f7f5f0] p-5">
              <p className="text-xs uppercase tracking-wider text-gray-500">
                URL
              </p>

              <p className="mt-2 break-all text-sm font-medium text-[#b8893c]">
                /services/{slug}
              </p>
            </div>

          </div>
        </section>

        {/* ======================================================
            DANGER ZONE
        ====================================================== */}

        <section className="rounded-3xl border border-red-200 bg-white p-6 shadow-sm md:p-8">

          <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-red-500">
                Danger Zone
              </p>

              <h2 className="mt-3 text-xl font-semibold text-black">
                Hapus Service
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-600">
                Menghapus service akan menghilangkannya dari
                database. Pastikan service memang sudah tidak
                diperlukan sebelum melanjutkan.
              </p>
            </div>

            <button
              type="button"
              onClick={handleDelete}
              disabled={deleting}
              className="inline-flex shrink-0 items-center justify-center rounded-full border border-red-300 px-6 py-3 text-sm font-medium text-red-600 transition hover:bg-red-600 hover:!text-white disabled:cursor-not-allowed disabled:opacity-50"
            >
              {deleting
                ? "Menghapus..."
                : "Hapus Service"}
            </button>

          </div>

        </section>

      </div>
    </main>
  );
}