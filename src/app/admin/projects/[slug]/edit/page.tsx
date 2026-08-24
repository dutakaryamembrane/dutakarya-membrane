"use client";

import {
  FormEvent,
  useEffect,
  useState,
} from "react";
import Link from "next/link";
import {
  useParams,
  useRouter,
} from "next/navigation";

// ============================================================
// TYPES
// ============================================================

type Media = {
  id: string;
  type: string;
  source: string;
  url: string;
  publicId: string | null;
  filename: string | null;
  mimeType: string | null;
  size: number | null;
  width: number | null;
  height: number | null;
  altText: string | null;
  caption: string | null;
  thumbnailUrl: string | null;
  externalUrl: string | null;
  createdAt: string;
  updatedAt: string;
};

type ProjectMedia = {
  id: string;
  projectId: string;
  mediaId: string;
  sortOrder: number;
  isCover: boolean;
  createdAt: string;
  updatedAt: string;
  media: Media;
};

type Project = {
  id: string;
  title: string;
  slug: string;
  description: string;
  client: string | null;
  location: string | null;
  category: string | null;
  completionDate: string | null;
  published: boolean;
  featured: boolean;
  area: string | null;
  structure: string | null;
  membrane: string | null;
  technicalNotes: string | null;
  seoTitle: string | null;
  seoDescription: string | null;
  seoKeywords: string | null;
  ogImage: string | null;
  sortOrder: number;
  medias?: ProjectMedia[];
};

type ApiResponse = {
  success?: boolean;
  data?: Project;
  message?: string;
  error?: string;
};

type MediaUploadResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: {
    projectMediaId: string;
    sortOrder: number;
    isCover: boolean;
    media: Media;
  };
};

type MediaMutationResponse = {
  success?: boolean;
  message?: string;
  error?: string;
  data?: ProjectMedia & {
    deletedProjectMediaId?: string;
    deletedMediaId?: string;
    promotedCoverId?: string | null;
  };
};

// ============================================================
// SORT MEDIA
// ============================================================

function sortProjectMedias(
  items: ProjectMedia[]
) {
  return [...items].sort((a, b) => {
    if (
      Number(b.isCover) !==
      Number(a.isCover)
    ) {
      return (
        Number(b.isCover) -
        Number(a.isCover)
      );
    }

    if (a.sortOrder !== b.sortOrder) {
      return a.sortOrder - b.sortOrder;
    }

    return (
      new Date(a.createdAt).getTime() -
      new Date(b.createdAt).getTime()
    );
  });
}

// ============================================================
// COMPONENT
// ============================================================

export default function EditProjectPage() {
  const params = useParams();
  const router = useRouter();

  const slug = params.slug as string;

  // ==========================================================
  // PROJECT STATE
  // ==========================================================

  const [project, setProject] =
    useState<Project | null>(null);

  const [medias, setMedias] =
    useState<ProjectMedia[]>([]);

  // ==========================================================
  // GENERAL STATE
  // ==========================================================

  const [loading, setLoading] =
    useState(true);

  const [saving, setSaving] =
    useState(false);

  // ==========================================================
  // MEDIA UPLOAD STATE
  // ==========================================================

  const [uploading, setUploading] =
    useState(false);

  const [selectedFile, setSelectedFile] =
    useState<File | null>(null);

  const [altText, setAltText] =
    useState("");

  const [caption, setCaption] =
    useState("");

  const [uploadAsCover, setUploadAsCover] =
    useState(false);

  // ==========================================================
  // MEDIA ACTION STATE
  // ==========================================================

  const [mediaSavingId, setMediaSavingId] =
    useState<string | null>(null);

  const [mediaDeletingId, setMediaDeletingId] =
    useState<string | null>(null);

  // ==========================================================
  // MESSAGES
  // ==========================================================

  const [error, setError] =
    useState("");

  const [success, setSuccess] =
    useState("");

  const [mediaError, setMediaError] =
    useState("");

  const [mediaSuccess, setMediaSuccess] =
    useState("");

  // ==========================================================
  // LOAD PROJECT
  // ==========================================================

  async function loadProject(
    showLoading = true
  ) {
    if (!slug) {
      return;
    }

    try {
      if (showLoading) {
        setLoading(true);
      }

      setError("");

      const response = await fetch(
        `/api/projects/${slug}`,
        {
          method: "GET",
          cache: "no-store",
        }
      );

      const result: ApiResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Project tidak dapat ditemukan."
        );
      }

      setProject({
        ...result.data,

        completionDate:
          result.data.completionDate
            ? result.data.completionDate.slice(
                0,
                10
              )
            : null,

        client:
          result.data.client ?? "",

        location:
          result.data.location ?? "",

        category:
          result.data.category ?? "",

        area:
          result.data.area ?? "",

        structure:
          result.data.structure ?? "",

        membrane:
          result.data.membrane ?? "",

        technicalNotes:
          result.data.technicalNotes ?? "",

        seoTitle:
          result.data.seoTitle ?? "",

        seoDescription:
          result.data.seoDescription ?? "",

        seoKeywords:
          result.data.seoKeywords ?? "",

        ogImage:
          result.data.ogImage ?? "",
      });

      setMedias(
        sortProjectMedias(
          result.data.medias ?? []
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengambil project."
      );
    } finally {
      if (showLoading) {
        setLoading(false);
      }
    }
  }

  useEffect(() => {
    loadProject();
  }, [slug]);

  // ==========================================================
  // HANDLE INPUT PROJECT
  // ==========================================================

  function updateField(
    field: keyof Project,
    value:
      | string
      | boolean
      | number
      | null
  ) {
    setProject((current) => {
      if (!current) {
        return current;
      }

      return {
        ...current,
        [field]: value,
      };
    });
  }

  // ==========================================================
  // SAVE PROJECT
  // ==========================================================

  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    if (!project) {
      return;
    }

    try {
      setSaving(true);

      setError("");
      setSuccess("");

      const payload = {
        title: project.title,
        slug: project.slug,
        description: project.description,

        client:
          project.client || null,

        location:
          project.location || null,

        category:
          project.category || null,

        completionDate:
          project.completionDate
            ? new Date(
                `${project.completionDate}T00:00:00.000Z`
              ).toISOString()
            : null,

        published:
          project.published,

        featured:
          project.featured,

        area:
          project.area || null,

        structure:
          project.structure || null,

        membrane:
          project.membrane || null,

        technicalNotes:
          project.technicalNotes || null,

        seoTitle:
          project.seoTitle || null,

        seoDescription:
          project.seoDescription || null,

        seoKeywords:
          project.seoKeywords || null,

        ogImage:
          project.ogImage || null,

        sortOrder:
          Number(project.sortOrder) || 0,
      };

      const response = await fetch(
        `/api/projects/${slug}`,
        {
          method: "PUT",

          headers: {
            "Content-Type":
              "application/json",
          },

          body: JSON.stringify(payload),
        }
      );

      const result: ApiResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Project gagal disimpan."
        );
      }

      setSuccess(
        "Project berhasil diperbarui."
      );

      // --------------------------------------------------------
      // Jika slug berubah
      // --------------------------------------------------------

      if (
        result.data?.slug &&
        result.data.slug !== slug
      ) {
        router.push(
          `/admin/projects/${result.data.slug}/edit`
        );

        return;
      }

      // --------------------------------------------------------
      // Update project dari response
      // --------------------------------------------------------

      if (result.data) {
        setProject({
          ...result.data,

          completionDate:
            result.data.completionDate
              ? result.data.completionDate.slice(
                  0,
                  10
                )
              : null,

          client:
            result.data.client ?? "",

          location:
            result.data.location ?? "",

          category:
            result.data.category ?? "",

          area:
            result.data.area ?? "",

          structure:
            result.data.structure ?? "",

          membrane:
            result.data.membrane ?? "",

          technicalNotes:
            result.data.technicalNotes ?? "",

          seoTitle:
            result.data.seoTitle ?? "",

          seoDescription:
            result.data.seoDescription ?? "",

          seoKeywords:
            result.data.seoKeywords ?? "",

          ogImage:
            result.data.ogImage ?? "",
        });

        setMedias(
          sortProjectMedias(
            result.data.medias ?? medias
          )
        );
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat menyimpan project."
      );
    } finally {
      setSaving(false);
    }
  }

  // ==========================================================
  // HANDLE FILE SELECTION
  // ==========================================================

  function handleFileChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0] ?? null;

    setMediaError("");
    setMediaSuccess("");

    if (!file) {
      setSelectedFile(null);
      return;
    }

    // --------------------------------------------------------
    // Validasi tipe
    // --------------------------------------------------------

    if (!file.type.startsWith("image/")) {
      setSelectedFile(null);

      setMediaError(
        "File harus berupa gambar."
      );

      event.target.value = "";

      return;
    }

    // --------------------------------------------------------
    // Validasi ukuran
    // --------------------------------------------------------

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

    if (!altText) {
      setAltText(
        project?.title ||
          "Project Duta Karya Membrane"
      );
    }
  }

  // ==========================================================
  // UPLOAD MEDIA
  // ==========================================================

  async function handleMediaUpload() {
    if (!selectedFile) {
      setMediaError(
        "Silakan pilih gambar terlebih dahulu."
      );

      return;
    }

    try {
      setUploading(true);

      setMediaError("");
      setMediaSuccess("");

      const formData =
        new FormData();

      formData.append(
        "file",
        selectedFile
      );

      formData.append(
        "altText",
        altText ||
          project?.title ||
          "Project Duta Karya Membrane"
      );

      formData.append(
        "caption",
        caption
      );

      formData.append(
        "isCover",
        uploadAsCover
          ? "true"
          : "false"
      );

      const response =
        await fetch(
          `/api/projects/${slug}/media`,
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
            "Media gagal diupload."
        );
      }

      if (!result.data) {
        throw new Error(
          "Media berhasil diupload tetapi data media tidak ditemukan."
        );
      }

      const newProjectMedia:
        ProjectMedia = {
        id:
          result.data.projectMediaId,

        projectId:
          project?.id || "",

        mediaId:
          result.data.media.id,

        sortOrder:
          result.data.sortOrder,

        isCover:
          result.data.isCover,

        createdAt:
          result.data.media.createdAt,

        updatedAt:
          result.data.media.updatedAt,

        media:
          result.data.media,
      };

      setMedias((current) => {
        let updated =
          current;

        // Jika upload baru menjadi cover,
        // semua cover lama dilepas.
        if (
          result.data?.isCover
        ) {
          updated =
            current.map(
              (item) => ({
                ...item,
                isCover: false,
              })
            );
        }

        updated = [
          ...updated,
          newProjectMedia,
        ];

        return sortProjectMedias(
          updated
        );
      });

      // Reset upload form
      setSelectedFile(null);
      setAltText("");
      setCaption("");
      setUploadAsCover(false);

      const fileInput =
        document.getElementById(
          "projectMediaFile"
        ) as HTMLInputElement | null;

      if (fileInput) {
        fileInput.value = "";
      }

      setMediaSuccess(
        "Gambar project berhasil diupload."
      );
    } catch (err) {
      setMediaError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengupload gambar."
      );
    } finally {
      setUploading(false);
    }
  }

  // ==========================================================
  // UPDATE MEDIA LOCAL
  // ==========================================================

  function updateMediaLocal(
    projectMediaId: string,
    updater: (
      item: ProjectMedia
    ) => ProjectMedia
  ) {
    setMedias((current) =>
      sortProjectMedias(
        current.map((item) =>
          item.id === projectMediaId
            ? updater(item)
            : item
        )
      )
    );
  }

  // ==========================================================
  // SAVE MEDIA
  //
  // Simpan:
  // - Alt Text
  // - Caption
  // - Sort Order
  // ==========================================================

  async function handleSaveMedia(
    item: ProjectMedia
  ) {
    try {
      setMediaSavingId(item.id);

      setMediaError("");
      setMediaSuccess("");

      const response =
        await fetch(
          `/api/projects/${slug}/media`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              projectMediaId:
                item.id,

              sortOrder:
                Number(item.sortOrder),

              altText:
                item.media.altText ??
                "",

              caption:
                item.media.caption ??
                "",
            }),
          }
        );

      const result:
        MediaMutationResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Media gagal diperbarui."
        );
      }

      setMedias((current) =>
        sortProjectMedias(
          current.map(
            (currentItem) =>
              currentItem.id ===
              item.id
                ? result.data!
                : currentItem
          )
        )
      );

      setMediaSuccess(
        "Perubahan media berhasil disimpan."
      );
    } catch (err) {
      setMediaError(
        err instanceof Error
          ? err.message
          : "Gagal memperbarui media."
      );
    } finally {
      setMediaSavingId(null);
    }
  }

  // ==========================================================
  // SET MEDIA AS COVER
  // ==========================================================

  async function handleSetCover(
    item: ProjectMedia
  ) {
    if (item.isCover) {
      return;
    }

    try {
      setMediaSavingId(item.id);

      setMediaError("");
      setMediaSuccess("");

      const response =
        await fetch(
          `/api/projects/${slug}/media`,
          {
            method: "PATCH",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              projectMediaId:
                item.id,

              isCover: true,
            }),
          }
        );

      const result:
        MediaMutationResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success ||
        !result.data
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Gagal mengubah cover."
        );
      }

      setMedias((current) =>
        sortProjectMedias(
          current.map(
            (currentItem) => ({
              ...currentItem,
              isCover:
                currentItem.id ===
                item.id,
            })
          )
        )
      );

      setMediaSuccess(
        "Cover project berhasil diubah."
      );
    } catch (err) {
      setMediaError(
        err instanceof Error
          ? err.message
          : "Gagal mengubah cover project."
      );
    } finally {
      setMediaSavingId(null);
    }
  }

  // ==========================================================
  // DELETE MEDIA
  // ==========================================================

  async function handleDeleteMedia(
    item: ProjectMedia
  ) {
    const filename =
      item.media.filename ||
      "gambar project";

    const confirmed =
      window.confirm(
        `Hapus "${filename}"?\n\nGambar akan dilepas dari project. Jika gambar tidak digunakan project lain, file Cloudinary juga akan dihapus.`
      );

    if (!confirmed) {
      return;
    }

    try {
      setMediaDeletingId(item.id);

      setMediaError("");
      setMediaSuccess("");

      const response =
        await fetch(
          `/api/projects/${slug}/media`,
          {
            method: "DELETE",

            headers: {
              "Content-Type":
                "application/json",
            },

            body: JSON.stringify({
              projectMediaId:
                item.id,
            }),
          }
        );

      const result:
        MediaMutationResponse =
        await response.json();

      if (
        !response.ok ||
        !result.success
      ) {
        throw new Error(
          result.message ||
            result.error ||
            "Media gagal dihapus."
        );
      }

      // --------------------------------------------------------
      // Hapus dari state
      // --------------------------------------------------------

      setMedias((current) => {
        let updated =
          current.filter(
            (currentItem) =>
              currentItem.id !==
              item.id
          );

        // Jika server mempromosikan cover baru,
        // update state supaya langsung terlihat.
        if (
          result.data
            ?.promotedCoverId
        ) {
          updated =
            updated.map(
              (currentItem) => ({
                ...currentItem,
                isCover:
                  currentItem.id ===
                  result.data
                    ?.promotedCoverId,
              })
            );
        }

        return sortProjectMedias(
          updated
        );
      });

      setMediaSuccess(
        "Media project berhasil dihapus."
      );
    } catch (err) {
      setMediaError(
        err instanceof Error
          ? err.message
          : "Gagal menghapus media project."
      );
    } finally {
      setMediaDeletingId(null);
    }
  }

  // ==========================================================
  // LOADING
  // ==========================================================

  if (loading) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-10 text-center shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#b8893c]">
              Duta Karya Membrane
            </p>

            <p className="mt-4 text-gray-500">
              Memuat project...
            </p>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // PROJECT NOT FOUND
  // ==========================================================

  if (!project) {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
        <div className="mx-auto max-w-5xl">
          <div className="rounded-3xl bg-white p-10 shadow-sm">
            <p className="text-sm uppercase tracking-[0.25em] text-[#b8893c]">
              Duta Karya Membrane
            </p>

            <h1 className="mt-4 text-3xl font-semibold text-black">
              Project Tidak Ditemukan
            </h1>

            <p className="mt-3 text-gray-600">
              {error ||
                "Project yang ingin diedit tidak ditemukan."}
            </p>

            <Link
              href="/admin/projects"
              className="mt-6 inline-flex rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c]"
            >
              ← Kembali ke Project
            </Link>
          </div>
        </div>
      </main>
    );
  }

  // ==========================================================
  // MAIN PAGE
  // ==========================================================

  return (
    <main className="min-h-screen bg-[#f5f3ee] px-6 py-10 md:px-10 lg:px-14">
      <div className="mx-auto max-w-5xl">

        {/* ====================================================
            HEADER
        ==================================================== */}

        <div className="mb-8 rounded-3xl bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.25em] text-[#b8893c]">
                Duta Karya Membrane
              </p>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-black">
                Edit Project
              </h1>

              <p className="mt-3 text-gray-600">
                Perbarui informasi project
                portfolio.
              </p>
            </div>

            <div className="flex flex-wrap gap-3">
              <Link
                href="/admin/projects"
                className="inline-flex items-center justify-center rounded-full border border-black/15 px-6 py-3 text-sm font-medium text-black transition hover:bg-black hover:!text-white"
              >
                ← Project
              </Link>

              <Link
                href={`/projects/${project.slug}`}
                target="_blank"
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c]"
              >
                Lihat Website →
              </Link>
            </div>
          </div>
        </div>

        {/* ====================================================
            GENERAL STATUS
        ==================================================== */}

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

        <form
          onSubmit={handleSubmit}
          className="space-y-6"
        >

          {/* ==================================================
              BASIC INFORMATION
          ================================================== */}

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
                  value={project.title}
                  onChange={(event) =>
                    updateField(
                      "title",
                      event.target.value
                    )
                  }
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
                  value={project.slug}
                  onChange={(event) =>
                    updateField(
                      "slug",
                      event.target.value
                    )
                  }
                  required
                  className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />

                <p className="mt-2 text-xs text-gray-500">
                  URL: /projects/
                  {project.slug}
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
                  value={
                    project.description
                  }
                  onChange={(event) =>
                    updateField(
                      "description",
                      event.target.value
                    )
                  }
                  required
                  rows={5}
                  className="w-full resize-y rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              PROJECT DETAILS
          ================================================== */}

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
                  value={
                    project.client ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "client",
                      event.target.value
                    )
                  }
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
                  value={
                    project.location ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "location",
                      event.target.value
                    )
                  }
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
                  value={
                    project.category ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "category",
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
                  value={
                    project.area ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "area",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: 120 m²"
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
                  value={
                    project.structure ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "structure",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Steel Structure"
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* MEMBRANE */}

              <div>
                <label
                  htmlFor="membrane"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Membrane
                </label>

                <input
                  id="membrane"
                  type="text"
                  value={
                    project.membrane ?? ""
                  }
                  onChange={(event) =>
                    updateField(
                      "membrane",
                      event.target.value
                    )
                  }
                  placeholder="Contoh: Membrane PVC / Polyester"
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
                  value={
                    project.completionDate ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "completionDate",
                      event.target.value ||
                        null
                    )
                  }
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>

              {/* SORT PROJECT */}

              <div>
                <label
                  htmlFor="sortOrder"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  Urutan Project
                </label>

                <input
                  id="sortOrder"
                  type="number"
                  value={
                    project.sortOrder
                  }
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
              </div>
            </div>

            {/* TECHNICAL NOTES */}

            <div className="mt-5">
              <label
                htmlFor="technicalNotes"
                className="mb-2 block text-sm font-medium text-black"
              >
                Technical Notes
              </label>

              <textarea
                id="technicalNotes"
                value={
                  project.technicalNotes ??
                  ""
                }
                onChange={(event) =>
                  updateField(
                    "technicalNotes",
                    event.target.value
                  )
                }
                rows={5}
                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
              />
            </div>
          </section>

          {/* ==================================================
              MEDIA PROJECT
          ================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Project Media
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Gambar Project
              </h2>

              <p className="mt-2 max-w-2xl text-sm leading-6 text-gray-500">
                Upload dokumentasi project
                yang akan ditampilkan pada
                halaman portfolio.
              </p>
            </div>

            {/* MEDIA SUCCESS */}

            {mediaSuccess && (
              <div className="mb-5 rounded-2xl border border-green-200 bg-green-50 px-5 py-4 text-sm text-green-700">
                {mediaSuccess}
              </div>
            )}

            {/* MEDIA ERROR */}

            {mediaError && (
              <div className="mb-5 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-700">
                {mediaError}
              </div>
            )}

            {/* ==================================================
                UPLOAD AREA
            ================================================== */}

            <div className="rounded-2xl border border-dashed border-gray-300 bg-[#faf9f6] p-5 md:p-6">

              <div className="grid gap-5 md:grid-cols-2">

                {/* FILE */}

                <div className="md:col-span-2">
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
                    JPG, PNG, WEBP, atau AVIF.
                    Maksimal 10MB.
                  </p>

                  {selectedFile && (
                    <div className="mt-3 rounded-xl bg-white px-4 py-3 text-sm text-gray-600">
                      File dipilih:{" "}
                      <span className="font-medium text-black">
                        {
                          selectedFile.name
                        }
                      </span>
                    </div>
                  )}
                </div>

                {/* ALT TEXT */}

                <div>
                  <label
                    htmlFor="mediaAltText"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Alt Text
                  </label>

                  <input
                    id="mediaAltText"
                    type="text"
                    value={altText}
                    onChange={(event) =>
                      setAltText(
                        event.target.value
                      )
                    }
                    placeholder={
                      project.title
                    }
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                  />
                </div>

                {/* CAPTION */}

                <div>
                  <label
                    htmlFor="mediaCaption"
                    className="mb-2 block text-sm font-medium text-black"
                  >
                    Caption
                  </label>

                  <input
                    id="mediaCaption"
                    type="text"
                    value={caption}
                    onChange={(event) =>
                      setCaption(
                        event.target.value
                      )
                    }
                    placeholder="Dokumentasi project"
                    className="w-full rounded-xl border border-gray-300 bg-white px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                  />
                </div>

                {/* COVER */}

                <div className="md:col-span-2">
                  <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-gray-200 bg-white p-4 transition hover:border-[#b8893c]">

                    <input
                      type="checkbox"
                      checked={
                        uploadAsCover
                      }
                      onChange={(event) =>
                        setUploadAsCover(
                          event.target
                            .checked
                        )
                      }
                      className="mt-1 h-5 w-5 accent-[#b8893c]"
                    />

                    <div>
                      <p className="font-medium text-black">
                        Jadikan sebagai
                        Cover
                      </p>

                      <p className="mt-1 text-sm text-gray-500">
                        Gambar ini akan
                        menjadi gambar
                        utama project.
                        Cover sebelumnya
                        otomatis dilepas.
                      </p>
                    </div>
                  </label>
                </div>

                {/* UPLOAD */}

                <div className="md:col-span-2">
                  <button
                    type="button"
                    onClick={
                      handleMediaUpload
                    }
                    disabled={
                      uploading ||
                      !selectedFile
                    }
                    className="inline-flex w-full items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    {uploading
                      ? "Mengupload..."
                      : "Upload Gambar"}
                  </button>
                </div>
              </div>
            </div>

            {/* ==================================================
                MEDIA LIST
            ================================================== */}

            <div className="mt-8">

              <div className="mb-5">
                <h3 className="text-lg font-semibold text-black">
                  Media Project
                </h3>

                <p className="mt-1 text-sm text-gray-500">
                  {medias.length} gambar
                  tersimpan.
                </p>
              </div>

              {medias.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-gray-300 bg-[#faf9f6] px-6 py-10 text-center">
                  <p className="text-sm font-medium text-gray-600">
                    Belum ada gambar
                    project.
                  </p>

                  <p className="mt-1 text-xs text-gray-400">
                    Upload gambar
                    pertama menggunakan
                    form di atas.
                  </p>
                </div>
              ) : (
                <div className="grid gap-5 lg:grid-cols-2">

                  {medias.map(
                    (item) => {
                      const isSaving =
                        mediaSavingId ===
                        item.id;

                      const isDeleting =
                        mediaDeletingId ===
                        item.id;

                      return (
                        <article
                          key={item.id}
                          className="overflow-hidden rounded-2xl border border-gray-200 bg-white"
                        >

                          {/* IMAGE */}

                          <div className="relative aspect-[16/10] overflow-hidden bg-[#f5f3ee]">

                            <img
                              src={
                                item.media
                                  .url
                              }
                              alt={
                                item.media
                                  .altText ||
                                project.title
                              }
                              className="h-full w-full object-cover"
                            />

                            {/* COVER BADGE */}

                            {item.isCover && (
                              <div className="absolute left-3 top-3 rounded-full bg-[#b8893c] px-3 py-1.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                                Cover Utama
                              </div>
                            )}

                            {/* IMAGE NUMBER */}

                            <div className="absolute right-3 top-3 rounded-full bg-black/70 px-3 py-1.5 text-[10px] font-medium text-white">
                              #{item.sortOrder}
                            </div>
                          </div>

                          {/* MEDIA FORM */}

                          <div className="p-5">

                            {/* FILE INFO */}

                            <div className="mb-5">
                              <p className="truncate text-sm font-semibold text-black">
                                {item.media
                                  .filename ||
                                  "Project Image"}
                              </p>

                              <p className="mt-1 text-xs text-gray-500">
                                {item.media
                                  .width &&
                                item.media
                                  .height
                                  ? `${item.media.width} × ${item.media.height}px`
                                  : "Dimensi tidak tersedia"}
                              </p>
                            </div>

                            {/* ALT */}

                            <div>
                              <label
                                htmlFor={`alt-${item.id}`}
                                className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                              >
                                Alt Text
                              </label>

                              <input
                                id={`alt-${item.id}`}
                                type="text"
                                value={
                                  item.media
                                    .altText ??
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateMediaLocal(
                                    item.id,
                                    (
                                      current
                                    ) => ({
                                      ...current,

                                      media: {
                                        ...current.media,

                                        altText:
                                          event
                                            .target
                                            .value,
                                      },
                                    })
                                  )
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                              />
                            </div>

                            {/* CAPTION */}

                            <div className="mt-4">
                              <label
                                htmlFor={`caption-${item.id}`}
                                className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                              >
                                Caption
                              </label>

                              <textarea
                                id={`caption-${item.id}`}
                                value={
                                  item.media
                                    .caption ??
                                  ""
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateMediaLocal(
                                    item.id,
                                    (
                                      current
                                    ) => ({
                                      ...current,

                                      media: {
                                        ...current.media,

                                        caption:
                                          event
                                            .target
                                            .value,
                                      },
                                    })
                                  )
                                }
                                rows={3}
                                className="w-full resize-y rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                              />
                            </div>

                            {/* SORT ORDER */}

                            <div className="mt-4">
                              <label
                                htmlFor={`sort-${item.id}`}
                                className="mb-2 block text-xs font-medium uppercase tracking-wide text-gray-500"
                              >
                                Urutan Gambar
                              </label>

                              <input
                                id={`sort-${item.id}`}
                                type="number"
                                min="0"
                                value={
                                  item.sortOrder
                                }
                                onChange={(
                                  event
                                ) =>
                                  updateMediaLocal(
                                    item.id,
                                    (
                                      current
                                    ) => ({
                                      ...current,

                                      sortOrder:
                                        Math.max(
                                          0,
                                          Number(
                                            event
                                              .target
                                              .value
                                          ) || 0
                                        ),
                                    })
                                  )
                                }
                                className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                              />

                              <p className="mt-2 text-xs text-gray-400">
                                Angka lebih
                                kecil =
                                posisi lebih
                                awal.
                              </p>
                            </div>

                            {/* COVER STATUS */}

                            <div className="mt-5 rounded-2xl bg-[#faf9f6] p-4">

                              <div className="flex items-start justify-between gap-4">

                                <div>
                                  <p className="text-sm font-medium text-black">
                                    {item.isCover
                                      ? "Cover aktif"
                                      : "Bukan cover"}
                                  </p>

                                  <p className="mt-1 text-xs leading-5 text-gray-500">
                                    {item.isCover
                                      ? "Gambar ini digunakan sebagai gambar utama project."
                                      : "Gambar ini tampil sebagai bagian dari gallery."}
                                  </p>
                                </div>

                                {!item.isCover && (
                                  <button
                                    type="button"
                                    onClick={() =>
                                      handleSetCover(
                                        item
                                      )
                                    }
                                    disabled={
                                      isSaving ||
                                      isDeleting
                                    }
                                    className="shrink-0 rounded-full border border-[#b8893c] px-4 py-2 text-xs font-semibold text-[#9b762f] transition hover:bg-[#b8893c] hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                                  >
                                    {isSaving
                                      ? "..."
                                      : "Jadikan Cover"}
                                  </button>
                                )}
                              </div>
                            </div>

                            {/* ACTIONS */}

                            <div className="mt-5 flex flex-col gap-3 sm:flex-row">

                              <button
                                type="button"
                                onClick={() =>
                                  handleSaveMedia(
                                    item
                                  )
                                }
                                disabled={
                                  isSaving ||
                                  isDeleting
                                }
                                className="flex-1 rounded-full bg-[#171717] px-5 py-3 text-sm font-semibold !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isSaving
                                  ? "Menyimpan..."
                                  : "Simpan Perubahan"}
                              </button>

                              <button
                                type="button"
                                onClick={() =>
                                  handleDeleteMedia(
                                    item
                                  )
                                }
                                disabled={
                                  isSaving ||
                                  isDeleting
                                }
                                className="rounded-full border border-red-200 px-5 py-3 text-sm font-medium text-red-500 transition hover:border-red-500 hover:bg-red-500 hover:text-white disabled:cursor-not-allowed disabled:opacity-50"
                              >
                                {isDeleting
                                  ? "Menghapus..."
                                  : "Hapus"}
                              </button>
                            </div>

                          </div>
                        </article>
                      );
                    }
                  )}
                </div>
              )}
            </div>
          </section>

          {/* ==================================================
              STATUS
          ================================================== */}

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

              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-[#b8893c]">

                <input
                  type="checkbox"
                  checked={
                    project.published
                  }
                  onChange={(event) =>
                    updateField(
                      "published",
                      event.target
                        .checked
                    )
                  }
                  className="mt-1 h-5 w-5 accent-[#b8893c]"
                />

                <div>
                  <p className="font-medium text-black">
                    Published
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Project dapat tampil
                    pada website publik.
                  </p>
                </div>
              </label>

              {/* FEATURED */}

              <label className="flex cursor-pointer items-start gap-4 rounded-2xl border border-gray-200 p-5 transition hover:border-[#b8893c]">

                <input
                  type="checkbox"
                  checked={
                    project.featured
                  }
                  onChange={(event) =>
                    updateField(
                      "featured",
                      event.target
                        .checked
                    )
                  }
                  className="mt-1 h-5 w-5 accent-[#b8893c]"
                />

                <div>
                  <p className="font-medium text-black">
                    Featured
                  </p>

                  <p className="mt-1 text-sm text-gray-500">
                    Project ditandai
                    sebagai project
                    unggulan.
                  </p>
                </div>
              </label>
            </div>
          </section>

          {/* ==================================================
              SEO
          ================================================== */}

          <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

            <div className="mb-6">
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Search Engine Optimization
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                SEO
              </h2>
            </div>

            <div className="space-y-5">

              {/* SEO TITLE */}

              <div>
                <label
                  htmlFor="seoTitle"
                  className="mb-2 block text-sm font-medium text-black"
                >
                  SEO Title
                </label>

                <input
                  id="seoTitle"
                  type="text"
                  value={
                    project.seoTitle ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "seoTitle",
                      event.target.value
                    )
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
                    project.seoDescription ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "seoDescription",
                      event.target.value
                    )
                  }
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
                    project.seoKeywords ??
                    ""
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
                  Pisahkan keyword
                  menggunakan koma.
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
                  value={
                    project.ogImage ??
                    ""
                  }
                  onChange={(event) =>
                    updateField(
                      "ogImage",
                      event.target.value
                    )
                  }
                  placeholder="https://..."
                  className="w-full rounded-xl border border-gray-300 px-4 py-3 text-sm text-black outline-none transition focus:border-[#b8893c] focus:ring-2 focus:ring-[#b8893c]/10"
                />
              </div>
            </div>
          </section>

          {/* ==================================================
              SAVE PROJECT
          ================================================== */}

          <div className="sticky bottom-4 z-10 rounded-3xl border border-black/10 bg-white/95 p-4 shadow-lg backdrop-blur">

            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

              <div>
                <p className="text-sm font-medium text-black">
                  Simpan perubahan project
                </p>

                <p className="text-xs text-gray-500">
                  Perubahan informasi project
                  akan langsung dikirim ke
                  database.
                </p>
              </div>

              <button
                type="submit"
                disabled={saving}
                className="inline-flex min-w-40 items-center justify-center rounded-full bg-[#171717] px-7 py-3 text-sm font-semibold !text-white transition hover:bg-[#b8893c] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving
                  ? "Menyimpan..."
                  : "Simpan Project"}
              </button>
            </div>
          </div>

        </form>
      </div>
    </main>
  );
}