import Link from "next/link";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";

import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import DeleteProjectButton from "@/components/admin/DeleteProjectButton";

export default async function AdminProjectsPage() {
  // ============================================================
  // AUTHENTICATION
  // ============================================================

  const session = await getServerSession(authOptions);

  if (!session?.user) {
    redirect("/login");
  }

  const user = session.user as {
    id?: string;
    name?: string | null;
    email?: string | null;
    role?: string;
  };

  // ============================================================
  // ADMIN ONLY
  // ============================================================

  if (user.role !== "ADMIN") {
    return (
      <main className="min-h-screen bg-[#f5f3ee] px-6 py-16">
        <div className="mx-auto max-w-4xl rounded-3xl bg-white p-8 shadow-sm">
          <p className="text-sm uppercase tracking-[0.25em] text-[#b8893c]">
            Duta Karya Membrane
          </p>

          <h1 className="mt-4 text-3xl font-semibold text-black">
            Akses Ditolak
          </h1>

          <p className="mt-3 text-gray-600">
            Akun Anda tidak memiliki akses ke halaman administrator.
          </p>

          <Link
            href="/admin"
            className="mt-6 inline-flex rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition hover:bg-[#b8893c]"
          >
            Kembali ke Dashboard
          </Link>
        </div>
      </main>
    );
  }

  // ============================================================
  // GET PROJECTS
  // ============================================================

  const projects = await prisma.project.findMany({
    orderBy: [
      {
        featured: "desc",
      },
      {
        sortOrder: "asc",
      },
      {
        createdAt: "desc",
      },
    ],
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      client: true,
      location: true,
      category: true,
      published: true,
      featured: true,
      area: true,
      structure: true,
      membrane: true,
      completionDate: true,
      createdAt: true,
      ogImage: true,

      // ========================================================
      // PROJECT MEDIA
      // Ambil cover terlebih dahulu, kemudian berdasarkan
      // urutan media.
      // ========================================================

      medias: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            sortOrder: "asc",
          },
        ],
        take: 1,
        select: {
          isCover: true,
          sortOrder: true,
          media: {
            select: {
              url: true,
              altText: true,
            },
          },
        },
      },
    },
  });

  // ============================================================
  // FORMAT DATE
  // ============================================================

  const formatDate = (date: Date | null) => {
    if (!date) {
      return "-";
    }

    return new Intl.DateTimeFormat("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
    }).format(date);
  };

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
                Project Management
              </h1>

              <p className="mt-3 max-w-2xl text-gray-600">
                Kelola project portfolio yang ditampilkan pada website Duta
                Karya Membrane.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-end gap-3">

              {/* NEW PROJECT */}

              <a
                href="/admin/projects/new"
                className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full bg-[#171717] px-6 py-3 text-sm font-medium !text-white transition-all duration-200 hover:bg-[#b89452] hover:!text-white"
              >
                New Project
              </a>

              {/* CONSULTATIONS */}

              <a
                href="/admin/consultations"
                className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium !text-[#171717] transition-all duration-200 hover:border-[#b89452] hover:bg-[#b89452] hover:!text-white"
              >
                Consultations
              </a>

              <Link
                href="/admin/services"
                className="rounded-full border border-black/10 bg-white px-6 py-3 text-center text-sm font-medium text-[#171717] transition hover:border-[#b8893c] hover:bg-[#b8893c] hover:text-white"
              >
                Services
              </Link>
              
              {/* HOMEPAGE */}

              <a
                href="/"
                className="inline-flex min-h-[44px] items-center justify-center whitespace-nowrap rounded-full border border-black/10 bg-white px-6 py-3 text-sm font-medium !text-[#171717] transition-all duration-200 hover:border-[#b8893c] hover:bg-[#b8893c] hover:!text-white"
              >
                ← Homepage
              </a>

            </div>
          </div>
        </div>

        {/* ======================================================
            SUMMARY
        ====================================================== */}

        <div className="mb-8 grid gap-4 md:grid-cols-3">

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Total Project
            </p>

            <p className="mt-2 text-3xl font-semibold text-black">
              {projects.length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Published
            </p>

            <p className="mt-2 text-3xl font-semibold text-black">
              {projects.filter((project) => project.published).length}
            </p>
          </div>

          <div className="rounded-2xl bg-white p-6 shadow-sm">
            <p className="text-sm text-gray-500">
              Featured
            </p>

            <p className="mt-2 text-3xl font-semibold text-black">
              {projects.filter((project) => project.featured).length}
            </p>
          </div>

        </div>

        {/* ======================================================
            PROJECT LIST
        ====================================================== */}

        <section className="rounded-3xl bg-white p-6 shadow-sm md:p-8">

          <div className="mb-6 flex items-center justify-between gap-4">

            <div>
              <p className="text-xs font-medium uppercase tracking-[0.25em] text-[#b8893c]">
                Portfolio
              </p>

              <h2 className="mt-2 text-2xl font-semibold text-black">
                Daftar Project
              </h2>
            </div>

            <span className="rounded-full bg-[#f5f3ee] px-4 py-2 text-xs font-medium text-gray-600">
              {projects.length} project
            </span>

          </div>

          {projects.length === 0 ? (

            <div className="rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center">

              <p className="text-lg font-medium text-black">
                Belum ada project
              </p>

              <p className="mt-2 text-sm text-gray-500">
                Project yang dibuat akan muncul di halaman ini.
              </p>

            </div>

          ) : (

            <div className="space-y-4">

              {projects.map((project) => {

                // ==================================================
                // COVER IMAGE
                // Prioritas:
                // 1. Media yang ditandai sebagai cover
                // 2. Media dengan sortOrder paling kecil
                // 3. Fallback ke ogImage
                // ==================================================

                const mediaImage = project.medias[0]?.media?.url;
                const imageUrl = mediaImage || project.ogImage;

                const imageAlt =
                  project.medias[0]?.media?.altText ||
                  project.title;

                return (
                  <article
                    key={project.id}
                    className="overflow-hidden rounded-2xl border border-gray-200 bg-white transition hover:border-[#b8893c]/50"
                  >

                    <div className="flex flex-col lg:flex-row">

                      {/* ==================================================
                          IMAGE
                      ================================================== */}

                      <div className="h-56 w-full shrink-0 bg-[#e8e5de] lg:h-auto lg:w-72">

                        {imageUrl ? (

                          <img
                            src={imageUrl}
                            alt={imageAlt}
                            className="h-full min-h-56 w-full object-cover"
                          />

                        ) : (

                          <div className="flex h-full min-h-56 items-center justify-center px-6 text-center">

                            <div>

                              <p className="text-xs font-medium uppercase tracking-[0.2em] text-[#b8893c]">
                                Duta Karya
                              </p>

                              <p className="mt-2 text-xs text-gray-500">
                                Belum ada gambar project
                              </p>

                            </div>

                          </div>

                        )}

                      </div>

                      {/* ==================================================
                          CONTENT
                      ================================================== */}

                      <div className="flex flex-1 flex-col p-6">

                        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">

                          <div>

                            <div className="flex flex-wrap items-center gap-2">

                              {project.featured && (
                                <span className="rounded-full bg-[#b8893c] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider !text-white">
                                  Featured
                                </span>
                              )}

                              {project.published ? (

                                <span className="rounded-full bg-green-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-green-700">
                                  Published
                                </span>

                              ) : (

                                <span className="rounded-full bg-gray-100 px-3 py-1 text-[10px] font-semibold uppercase tracking-wider text-gray-500">
                                  Draft
                                </span>

                              )}

                            </div>

                            <h3 className="mt-4 text-2xl font-semibold text-black">
                              {project.title}
                            </h3>

                            <p className="mt-1 text-sm text-[#b8893c]">
                              /projects/{project.slug}
                            </p>

                          </div>

                          <div className="shrink-0">

                            <span className="rounded-full bg-[#f5f3ee] px-4 py-2 text-xs text-gray-600">
                              {project.category || "Tanpa kategori"}
                            </span>

                          </div>

                        </div>

                        <p className="mt-5 line-clamp-2 max-w-3xl text-sm leading-6 text-gray-600">
                          {project.description}
                        </p>

                        {/* ==================================================
                            PROJECT INFO
                        ================================================== */}

                        <div className="mt-6 grid gap-4 border-t border-gray-100 pt-5 sm:grid-cols-2 lg:grid-cols-4">

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">
                              Client
                            </p>

                            <p className="mt-1 text-sm font-medium text-black">
                              {project.client || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">
                              Lokasi
                            </p>

                            <p className="mt-1 text-sm font-medium text-black">
                              {project.location || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">
                              Luas Area
                            </p>

                            <p className="mt-1 text-sm font-medium text-black">
                              {project.area || "-"}
                            </p>
                          </div>

                          <div>
                            <p className="text-[10px] uppercase tracking-wider text-gray-400">
                              Selesai
                            </p>

                            <p className="mt-1 text-sm font-medium text-black">
                              {formatDate(project.completionDate)}
                            </p>
                          </div>

                        </div>

                        {/* ==================================================
                            ACTIONS
                        ================================================== */}

                        <div className="mt-6 flex flex-wrap gap-3 border-t border-gray-100 pt-5">

                          <Link
                            href={`/projects/${project.slug}`}
                            target="_blank"
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 px-5 py-2.5 text-xs font-medium text-black transition hover:border-black hover:bg-black hover:!text-white"
                          >
                            Lihat Website →
                          </Link>

                          <Link
                            href={`/admin/projects/${project.slug}/edit`}
                            className="inline-flex items-center justify-center rounded-full bg-[#171717] px-5 py-2.5 text-xs font-medium !text-white transition hover:bg-[#b8893c]"
                          >
                            Edit Project
                          </Link>

                          <DeleteProjectButton
                            slug={project.slug}
                            title={project.title}
                          />

                        </div>

                      </div>

                    </div>

                  </article>
                );
              })}

            </div>

          )}

        </section>

      </div>
    </main>
  );
}