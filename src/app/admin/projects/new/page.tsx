"use client";

import {
  FormEvent,
  useMemo,
  useState,
} from "react";
import { useRouter } from "next/navigation";

type ProjectForm = {
  title: string;
  slug: string;
  description: string;

  client: string;
  location: string;
  category: string;
  completionDate: string;

  area: string;
  structure: string;
  membrane: string;
  technicalNotes: string;

  published: boolean;
  featured: boolean;
  sortOrder: number;

  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  ogImage: string;
};

type CreateProjectResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    id?: string;
    slug?: string;
    title?: string;
  };
};

type MediaUploadResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    projectMediaId: string;
    sortOrder: number;
    isCover: boolean;
    media: {
      id: string;
      url: string;
      filename?: string | null;
    };
  };
};

const initialForm: ProjectForm = {
  title: "",
  slug: "",
  description: "",

  client: "Duta Karya Membrane",
  location: "Bandung",
  category: "Kanopi Membrane",
  completionDate: "",

  area: "",
  structure: "Steel Structure",
  membrane: "Membrane PVC / Polyester",
  technicalNotes: "",

  published: true,
  featured: false,
  sortOrder: 0,

  seoTitle: "",
  seoDescription: "",
  seoKeywords: "",
  ogImage: "",
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

export default function NewProjectPage() {
  const router = useRouter();

  const [form, setForm] =
    useState<ProjectForm>(initialForm);

  const [saving, setSaving] =
    useState(false);

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  // ============================================================
  // MEDIA STATE
  // ============================================================

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [altText, setAltText] =
    useState("");

  const [caption, setCaption] =
    useState("");

  const [uploadAsCover, setUploadAsCover] =
    useState(true);

  const [mediaError, setMediaError] =
    useState("");

  // ============================================================
  // UPDATE FIELD
  // ============================================================

  function updateField<K extends keyof ProjectForm>(
    field: K,
    value: ProjectForm[K]
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  // ============================================================
  // TITLE → SLUG
  // ============================================================

  function handleTitleChange(value: string) {
    setForm((current) => {
      const previousAutoSlug =
        slugify(current.title);

      const shouldUpdateSlug =
        !current.slug ||
        current.slug === previousAutoSlug;

      return {
        ...current,
        title: value,
        slug: shouldUpdateSlug
          ? slugify(value)
          : current.slug,
      };
    });
  }

  // ============================================================
  // SEO DEFAULT
  // ============================================================

  const generatedSeoTitle = useMemo(() => {
    if (!form.title.trim()) {
      return "";
    }

    return `${form.title.trim()} | Duta Karya Membrane`;
  }, [form.title]);

  function useGeneratedSeoTitle() {
    updateField(
      "seoTitle",
      generatedSeoTitle
    );
  }

  // ============================================================
  // FILE CHANGE
  // ============================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setMediaError("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // Validasi tipe file
    if (!file.type.startsWith("image/")) {
      setSelectedFile(null);
      setMediaError(
        "File harus berupa gambar."
      );
      event.target.value = "";
      return;
    }

    // Maksimal 10 MB
    const maxSize =
      10 * 1024 * 1024;

    if (file.size > maxSize) {
      setSelectedFile(null);
      setMediaError(
        "Ukuran gambar maksimal 10MB."
      );
      event.target.value = "";
      return;
    }

    setSelectedFile(file);

    // Otomatis isi alt text jika masih kosong
    if (!altText) {
      setAltText(
        form.title ||
          "Project Duta Karya Membrane"
      );
    }

    // Otomatis isi caption jika masih kosong
    if (!caption) {
      setCaption(
        form.title
          ? `Dokumentasi ${form.title}`
          : "Dokumentasi project Duta Karya Membrane"
      );
    }
  }

  // ============================================================
  // UPLOAD MEDIA
  // ============================================================

  async function uploadProjectMedia(
    projectSlug: string
  ) {
    if (!selectedFile) {
      return true;
    }

    setUploading(true);
    setMediaError("");

    try {
      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "altText",
        altText.trim() ||
          form.title.trim() ||
          "Project Duta Karya Membrane"
      );

      formData.append(
        "caption",
        caption.trim()
      );

      formData.append(
        "isCover",
        uploadAsCover
          ? "true"
          : "false"
      );

      const response =
        await fetch(
          `/api/projects/${projectSlug}/media`,
          {
            method: "POST",
            body: formData,
          }
        );

      const result: MediaUploadResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Gambar project gagal diupload."
        );
      }

      return true;
    } catch (err) {
      const message =
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupload gambar.";

      setMediaError(message);

      return false;
    } finally {
      setUploading(false);
    }
  }

  // ============================================================
  // SUBMIT
  // ============================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");
    setMediaError("");

    // ==========================================================
    // BASIC VALIDATION
    // ==========================================================

    if (!form.title.trim()) {
      setError(
        "Judul project wajib diisi."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!form.slug.trim()) {
      setError(
        "Slug project wajib diisi."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    if (!form.description.trim()) {
      setError(
        "Deskripsi project wajib diisi."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      return;
    }

    try {
      setSaving(true);

      // ========================================================
      // PREPARE PAYLOAD
      // ========================================================

      const projectSlug =
        slugify(form.slug);

      const payload = {
        title: form.title.trim(),

        slug: projectSlug,

        description:
          form.description.trim(),

        client:
          form.client.trim() || null,

        location:
          form.location.trim() || null,

        category:
          form.category.trim() || null,

        completionDate:
          form.completionDate
            ? new Date(
                `${form.completionDate}T00:00:00.000Z`
              ).toISOString()
            : null,

        published:
          form.published,

        featured:
          form.featured,

        area:
          form.area.trim() || null,

        structure:
          form.structure.trim() || null,

        membrane:
          form.membrane.trim() || null,

        technicalNotes:
          form.technicalNotes.trim() ||
          null,

        seoTitle:
          form.seoTitle.trim() ||
          generatedSeoTitle ||
          null,

        seoDescription:
          form.seoDescription.trim() ||
          null,

        seoKeywords:
          form.seoKeywords.trim() ||
          null,

        ogImage:
          form.ogImage.trim() ||
          null,

        sortOrder:
          Number(form.sortOrder) || 0,
      };

      // ========================================================
      // CREATE PROJECT
      // ========================================================

      const response =
        await fetch(
          "/api/projects",
          {
            method: "POST",

            headers: {
              "Content-Type":
                "application/json",
            },

            body:
              JSON.stringify(payload),
          }
        );

      const result: CreateProjectResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            result.error ||
            `Project gagal disimpan. Status: ${response.status}`
        );
      }

      // ========================================================
      // GET CREATED SLUG
      // ========================================================

      const createdSlug =
        result.data?.slug ||
        projectSlug;

      // ========================================================
      // UPLOAD PROJECT IMAGE
      // ========================================================

      if (selectedFile) {
        const mediaUploaded =
          await uploadProjectMedia(
            createdSlug
          );

        if (!mediaUploaded) {
          setError(
            "Project berhasil dibuat, tetapi gambar gagal diupload. Silakan buka Edit Project untuk mencoba upload gambar lagi."
          );

          return;
        }
      }

      // ========================================================
      // SUCCESS
      // ========================================================

      setSuccess(
        selectedFile
          ? "Project dan gambar berhasil dibuat."
          : "Project berhasil dibuat."
      );

      // ========================================================
      // REDIRECT
      // ========================================================

      setTimeout(() => {
        router.push(
          "/admin/projects"
        );

        router.refresh();
      }, 700);
    } catch (err) {
      console.error(
        "Create project error:",
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat membuat project."
      );

      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    } finally {
      setSaving(false);
    }
  }

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">

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
                New Project
              </h1>

              <p className="mt-3 text-gray-600">
                Tambahkan project baru ke portfolio website.
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                router.push(
                  "/admin/projects"
                )
              }
              className="inline-flex w-fit items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:!text-white"
            >
              ← Project
            </button>

          </div>
        </div>

        {/* ======================================================
            SUCCESS
        ====================================================== */}

        {success && (
          <div className="mb-6 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
            {success}
          </div>
        )}

        {/* ======================================================
            ERROR
        ====================================================== */}

        {error && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}
          </div>
        )}

        {/* ======================================================
            FORM
        ====================================================== */}

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ====================================================
              BASIC INFORMATION
          ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Project Information
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Informasi Dasar
              </h2>
            </div>

            <div className="grid gap-5">

              {/* TITLE */}

              <div>
                <label
                  htmlFor="title"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Judul Project
                </label>

                <input
                  id="title"
                  type="text"
                  value={form.title}
                  onChange={(event) =>
                    handleTitleChange(
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Kanopi Membrane Bandung"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* SLUG */}

              <div>
                <label
                  htmlFor="slug"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Slug
                </label>

                <input
                  id="slug"
                  type="text"
                  value={form.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      slugify(
                        event.target.value
                      )
                    )
                  }
                  placeholder="kanopi-membrane-bandung"
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  URL: /projects/
                  {form.slug ||
                    "slug-project"}
                </p>
              </div>

              {/* DESCRIPTION */}

              <div>
                <label
                  htmlFor="description"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Deskripsi
                </label>

                <textarea
                  id="description"
                  value={form.description}
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  placeholder="Deskripsi singkat mengenai project..."
                  required
                  rows={5}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

            </div>
          </section>

          {/* ====================================================
              PROJECT DETAILS
          ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Project Details
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Detail Project
              </h2>
            </div>

            <div className="grid gap-5 md:grid-cols-2">

              {/* CLIENT */}

              <div>
                <label
                  htmlFor="client"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Client
                </label>

                <input
                  id="client"
                  type="text"
                  value={form.client}
                  onChange={(event) =>
                    updateField(
                      "client",
                      event.target.value
                    )
                  }
                  placeholder="Duta Karya Membrane"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* LOCATION */}

              <div>
                <label
                  htmlFor="location"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Lokasi
                </label>

                <input
                  id="location"
                  type="text"
                  value={form.location}
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
                  placeholder="Bandung"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* CATEGORY */}

              <div>
                <label
                  htmlFor="category"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Kategori
                </label>

                <input
                  id="category"
                  type="text"
                  value={form.category}
                  onChange={(event) =>
                    updateField(
                      "category",
                      event.target.value
                    )
                  }
                  placeholder="Kanopi Membrane"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* COMPLETION DATE */}

              <div>
                <label
                  htmlFor="completionDate"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Tanggal Selesai
                </label>

                <input
                  id="completionDate"
                  type="date"
                  value={form.completionDate}
                  onChange={(event) =>
                    updateField(
                      "completionDate",
                      event.target.value
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* AREA */}

              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Luas Area
                </label>

                <input
                  id="area"
                  type="text"
                  value={form.area}
                  onChange={(event) =>
                    updateField(
                      "area",
                      event.target.value
                    )
                  }
                  placeholder="120 m²"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* STRUCTURE */}

              <div>
                <label
                  htmlFor="structure"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Struktur
                </label>

                <input
                  id="structure"
                  type="text"
                  value={form.structure}
                  onChange={(event) =>
                    updateField(
                      "structure",
                      event.target.value
                    )
                  }
                  placeholder="Steel Structure"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* MEMBRANE */}

              <div className="md:col-span-2">
                <label
                  htmlFor="membrane"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Membrane
                </label>

                <input
                  id="membrane"
                  type="text"
                  value={form.membrane}
                  onChange={(event) =>
                    updateField(
                      "membrane",
                      event.target.value
                    )
                  }
                  placeholder="Membrane PVC / Polyester"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

            </div>

            {/* TECHNICAL NOTES */}

            <div className="mt-5">

              <label
                htmlFor="technicalNotes"
                className="mb-2 block text-sm font-medium text-black"
              >
                Catatan Teknis
              </label>

              <textarea
                id="technicalNotes"
                value={form.technicalNotes}
                onChange={(event) =>
                  updateField(
                    "technicalNotes",
                    event.target.value
                  )
                }
                placeholder="Informasi teknis tambahan..."
                rows={5}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
              />

            </div>

          </section>

          {/* ====================================================
              PROJECT MEDIA
          ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Project Media
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Gambar Project
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Upload gambar utama project. Gambar akan otomatis terhubung setelah project berhasil dibuat.
              </p>

            </div>

            {/* MEDIA ERROR */}

            {mediaError && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {mediaError}
              </div>
            )}

            <div className="space-y-5">

              {/* FILE */}

              <div>

                <label
                  htmlFor="projectMediaFile"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Gambar Project
                </label>

                <input
                  id="projectMediaFile"
                  type="file"
                  accept="image/jpeg,image/png,image/webp,image/avif"
                  onChange={
                    handleFileChange
                  }
                  className="block w-full cursor-pointer rounded-xl border border-gray-300 bg-white text-sm text-gray-700 file:mr-4 file:border-0 file:bg-[#171717] file:px-5 file:py-3 file:text-sm file:font-medium file:text-white hover:file:bg-[#b8893c]"
                />

                <p className="mt-2 text-xs text-gray-500">
                  JPG, PNG, WEBP, atau AVIF. Maksimal 10MB.
                </p>

              </div>

              {/* SELECTED FILE PREVIEW */}

              {selectedFile && (
                <div className="rounded-2xl border border-[#b8893c]/30 bg-[#b8893c]/5 p-4">

                  <p className="text-sm font-medium text-black">
                    File terpilih
                  </p>

                  <p className="mt-1 break-all text-sm text-gray-600">
                    {selectedFile.name}
                  </p>

                  <p className="mt-1 text-xs text-gray-500">
                    {(
                      selectedFile.size /
                      1024 /
                      1024
                    ).toFixed(2)}{" "}
                    MB
                  </p>

                </div>
              )}

              {/* ALT TEXT */}

              <div>

                <label
                  htmlFor="altText"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Alt Text
                </label>

                <input
                  id="altText"
                  type="text"
                  value={altText}
                  onChange={(event) =>
                    setAltText(
                      event.target.value
                    )
                  }
                  placeholder={
                    form.title ||
                    "Kanopi membrane custom di Bandung"
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Deskripsi singkat gambar untuk aksesibilitas dan SEO.
                </p>

              </div>

              {/* CAPTION */}

              <div>

                <label
                  htmlFor="caption"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Caption
                </label>

                <textarea
                  id="caption"
                  value={caption}
                  onChange={(event) =>
                    setCaption(
                      event.target.value
                    )
                  }
                  placeholder="Dokumentasi pemasangan kanopi membrane..."
                  rows={3}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

              </div>

              {/* COVER */}

              <label className="cursor-pointer rounded-2xl border border-gray-200 p-5 transition hover:border-[#b8893c]">

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={
                      uploadAsCover
                    }
                    onChange={(event) =>
                      setUploadAsCover(
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-[#b8893c]"
                  />

                  <div>

                    <p className="text-sm font-medium text-black">
                      Jadikan sebagai Cover
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Gambar ini akan digunakan sebagai gambar utama project.
                    </p>

                  </div>

                </div>

              </label>

              <div className="rounded-2xl border border-gray-200 bg-gray-50 px-5 py-4">

                <p className="text-sm font-medium text-black">
                  Upload dilakukan saat menyimpan project
                </p>

                <p className="mt-1 text-sm text-gray-500">
                  Tidak perlu upload secara terpisah. Setelah project dibuat, sistem akan langsung menghubungkan gambar ke project tersebut.
                </p>

              </div>

            </div>

          </section>

          {/* ====================================================
              PUBLISHING
          ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Publishing
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Status Project
              </h2>

            </div>

            <div className="grid gap-4 md:grid-cols-2">

              {/* PUBLISHED */}

              <label className="cursor-pointer rounded-2xl border border-gray-200 p-5 transition hover:border-[#b8893c]">

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={
                      form.published
                    }
                    onChange={(event) =>
                      updateField(
                        "published",
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-[#b8893c]"
                  />

                  <div>

                    <p className="text-sm font-medium text-black">
                      Published
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Project akan ditampilkan pada website publik.
                    </p>

                  </div>

                </div>

              </label>

              {/* FEATURED */}

              <label className="cursor-pointer rounded-2xl border border-gray-200 p-5 transition hover:border-[#b8893c]">

                <div className="flex items-start gap-3">

                  <input
                    type="checkbox"
                    checked={
                      form.featured
                    }
                    onChange={(event) =>
                      updateField(
                        "featured",
                        event.target.checked
                      )
                    }
                    className="mt-1 h-4 w-4 accent-[#b8893c]"
                  />

                  <div>

                    <p className="text-sm font-medium text-black">
                      Featured
                    </p>

                    <p className="mt-1 text-sm text-gray-500">
                      Project akan diprioritaskan sebagai project unggulan.
                    </p>

                  </div>

                </div>

              </label>

            </div>

            {/* SORT ORDER */}

            <div className="mt-5">

              <label
                htmlFor="sortOrder"
                className="mb-2 block text-sm font-medium text-black"
              >
                Urutan Project
              </label>

              <input
                id="sortOrder"
                type="number"
                value={form.sortOrder}
                onChange={(event) =>
                  updateField(
                    "sortOrder",
                    Number(
                      event.target.value
                    )
                  )
                }
                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
              />

              <p className="mt-2 text-xs text-gray-500">
                Angka lebih kecil akan memiliki prioritas urutan lebih tinggi.
              </p>

            </div>

          </section>

          {/* ====================================================
              SEO
          ==================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">

              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Search Engine
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                SEO & Metadata
              </h2>

              <p className="mt-2 text-sm text-gray-500">
                Opsional. Digunakan untuk optimasi mesin pencari dan social sharing.
              </p>

            </div>

            <div className="space-y-5">

              {/* SEO TITLE */}

              <div>

                <div className="mb-2 flex items-center justify-between gap-3">

                  <label
                    htmlFor="seoTitle"
                    className="block text-sm font-medium text-black"
                  >
                    SEO Title
                  </label>

                  {generatedSeoTitle && (
                    <button
                      type="button"
                      onClick={
                        useGeneratedSeoTitle
                      }
                      className="text-xs font-medium text-[#b8893c] hover:underline"
                    >
                      Gunakan otomatis
                    </button>
                  )}

                </div>

                <input
                  id="seoTitle"
                  type="text"
                  value={form.seoTitle}
                  onChange={(event) =>
                    updateField(
                      "seoTitle",
                      event.target.value
                    )
                  }
                  placeholder={
                    generatedSeoTitle ||
                    "Kanopi Membrane Bandung | Duta Karya Membrane"
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

              </div>

              {/* SEO DESCRIPTION */}

              <div>

                <label
                  htmlFor="seoDescription"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  SEO Description
                </label>

                <textarea
                  id="seoDescription"
                  value={
                    form.seoDescription
                  }
                  onChange={(event) =>
                    updateField(
                      "seoDescription",
                      event.target.value
                    )
                  }
                  placeholder="Deskripsi singkat untuk mesin pencari..."
                  rows={4}
                  className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

              </div>

              {/* SEO KEYWORDS */}

              <div>

                <label
                  htmlFor="seoKeywords"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  SEO Keywords
                </label>

                <input
                  id="seoKeywords"
                  type="text"
                  value={
                    form.seoKeywords
                  }
                  onChange={(event) =>
                    updateField(
                      "seoKeywords",
                      event.target.value
                    )
                  }
                  placeholder="kanopi membrane, kanopi Bandung, membrane custom"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Pisahkan keyword menggunakan koma.
                </p>

              </div>

              {/* OG IMAGE */}

              <div>

                <label
                  htmlFor="ogImage"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  OG Image URL
                </label>

                <input
                  id="ogImage"
                  type="url"
                  value={form.ogImage}
                  onChange={(event) =>
                    updateField(
                      "ogImage",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  Untuk sekarang boleh dikosongkan. Gambar project dapat digunakan melalui media project.
                </p>

              </div>

            </div>

          </section>

          {/* ====================================================
              SAVE
          ==================================================== */}

          <div className="sticky bottom-4 z-10 rounded-3xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>

                <p className="text-sm font-medium text-black">
                  Simpan project
                </p>

                <p className="text-xs text-gray-500">
                  {uploading
                    ? "Sedang mengupload gambar..."
                    : selectedFile
                    ? "Project dan gambar akan disimpan."
                    : "Project baru akan dikirim ke database."}
                </p>

              </div>

              <div className="flex items-center gap-3">

                <button
                  type="button"
                  disabled={
                    saving ||
                    uploading
                  }
                  onClick={() =>
                    router.push(
                      "/admin/projects"
                    )
                  }
                  className="inline-flex min-w-24 items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition hover:bg-gray-100 disabled:opacity-50"
                >
                  Batal
                </button>

                <button
                  type="submit"
                  disabled={
                    saving ||
                    uploading
                  }
                  className="inline-flex min-w-40 items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {uploading
                    ? "Upload Gambar..."
                    : saving
                    ? "Menyimpan..."
                    : "Simpan Project"}
                </button>

              </div>

            </div>

          </div>

        </form>

      </div>
    </main>
  );
}