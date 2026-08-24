import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";

type ProjectDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function ProjectDetailPage({
  params,
}: ProjectDetailPageProps) {
  const { slug } = await params;

  // ============================================================
  // AMBIL PROJECT + MEDIA DARI DATABASE
  // ============================================================

  const project = await prisma.project.findUnique({
    where: {
      slug,
    },

    include: {
      medias: {
        orderBy: [
          {
            isCover: "desc",
          },
          {
            sortOrder: "asc",
          },
          {
            createdAt: "asc",
          },
        ],

        include: {
          media: true,
        },
      },
    },
  });

  // ============================================================
  // PROJECT TIDAK DITEMUKAN
  // ============================================================

  if (!project) {
    notFound();
  }

  // ============================================================
  // PILIH COVER
  //
  // Prioritas:
  // 1. Media dengan isCover = true
  // 2. Media pertama
  // 3. project.ogImage
  // ============================================================

  const coverProjectMedia =
    project.medias.find((item) => item.isCover) ??
    project.medias[0] ??
    null;

  const coverMedia = coverProjectMedia?.media ?? null;

  const coverUrl = coverMedia?.url ?? project.ogImage ?? null;

  // ============================================================
  // FORMAT TANGGAL
  // ============================================================

  const formattedCompletionDate = project.completionDate
    ? new Intl.DateTimeFormat("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }).format(project.completionDate)
    : null;

  // ============================================================
  // RENDER
  // ============================================================

  return (
    <main className="min-h-screen bg-[#f5f3ee] text-[#171717]">
      {/* ======================================================
          HERO
      ====================================================== */}

      <section className="relative isolate overflow-hidden bg-[#171717] text-white">
        {/* HERO BACKGROUND IMAGE */}

        {coverMedia?.type !== "VIDEO" && coverUrl ? (
          <img
            src={coverUrl}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover object-center"
          />
        ) : null}

        {/* HERO OVERLAY */}

        <div className="absolute inset-0 bg-black/60" />

        {/* EXTRA BOTTOM GRADIENT */}

        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-black/70 to-transparent" />

        {/* HERO CONTENT */}

        <div className="relative mx-auto flex min-h-[420px] max-w-[1200px] items-end px-6 py-14 md:min-h-[500px] md:px-10 md:py-20 lg:px-16">
          <div className="w-full">
            {/* LABEL */}

            <div className="mb-6 flex items-center gap-3">
              <span className="h-px w-10 bg-[#bd9650]" />

              <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#bd9650]">
                Project
              </span>
            </div>

            {/* TITLE */}

            <h1 className="max-w-5xl text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-white md:text-6xl lg:text-7xl">
              {project.title}
            </h1>

            {/* LOCATION */}

            {project.location && (
              <div className="mt-7 flex items-center gap-3">
                <span className="h-1.5 w-1.5 rounded-full bg-[#bd9650]" />

                <p className="text-sm font-medium text-white/80">
                  {project.location}
                </p>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ======================================================
          PROJECT CONTENT
      ====================================================== */}

      <section className="mx-auto max-w-[1200px] px-6 py-12 md:px-10 md:py-16 lg:px-16 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          {/* ==================================================
              MAIN CONTENT
          ================================================== */}

          <div>
            {/* ==================================================
                PROJECT COVER
            ================================================== */}

            <div className="relative aspect-[16/10] overflow-hidden rounded-[24px] bg-[#3d3a34]">
              {coverMedia?.type === "VIDEO" ? (
                <video
                  src={coverMedia.url}
                  controls
                  playsInline
                  className="h-full w-full object-cover"
                  poster={coverMedia.thumbnailUrl ?? undefined}
                >
                  Browser Anda tidak mendukung video.
                </video>
              ) : coverUrl ? (
                <img
                  src={coverUrl}
                  alt={coverMedia?.altText || project.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center">
                  <div className="text-center">
                    <p className="text-[10px] font-medium uppercase tracking-[0.35em] text-[#bd9650]">
                      Duta Karya Membrane
                    </p>

                    <p className="mt-3 text-xs text-white/50">
                      Cover project belum tersedia
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* ==================================================
                MEDIA GALLERY
            ================================================== */}

            {project.medias.length > 1 && (
              <section className="mt-6">
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
                  {project.medias
                    .filter(
                      (item) =>
                        item.media.id !== coverMedia?.id
                    )
                    .map((item) => {
                      const media = item.media;

                      if (media.type === "VIDEO") {
                        return (
                          <div
                            key={item.id}
                            className="overflow-hidden rounded-[18px] bg-[#3d3a34]"
                          >
                            <video
                              src={media.url}
                              controls
                              playsInline
                              className="aspect-[4/3] h-full w-full object-cover"
                              poster={
                                media.thumbnailUrl ??
                                undefined
                              }
                            >
                              Browser Anda tidak mendukung
                              video.
                            </video>
                          </div>
                        );
                      }

                      return (
                        <div
                          key={item.id}
                          className="overflow-hidden rounded-[18px] bg-[#3d3a34]"
                        >
                          <img
                            src={media.url}
                            alt={
                              media.altText ||
                              project.title
                            }
                            className="aspect-[4/3] h-full w-full object-cover"
                          />
                        </div>
                      );
                    })}
                </div>
              </section>
            )}

            {/* ==================================================
                PROJECT OVERVIEW
            ================================================== */}

            <div className="mt-10">
              <div className="mb-4 flex items-center gap-3">
                <span className="h-px w-10 bg-[#bd9650]" />

                <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8f6d35]">
                  Project Overview
                </span>
              </div>

              <h2 className="text-3xl font-semibold tracking-[-0.03em]">
                Tentang Project
              </h2>

              <p className="mt-5 max-w-3xl whitespace-pre-line text-sm leading-7 text-[#55534d]">
                {project.description}
              </p>
            </div>

            {/* ==================================================
                TECHNICAL NOTES
            ================================================== */}

            {project.technicalNotes && (
              <div className="mt-12 border-t border-black/10 pt-8">
                <div className="mb-4 flex items-center gap-3">
                  <span className="h-px w-10 bg-[#bd9650]" />

                  <span className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8f6d35]">
                    Technical Notes
                  </span>
                </div>

                <p className="max-w-3xl whitespace-pre-line text-sm leading-7 text-[#55534d]">
                  {project.technicalNotes}
                </p>
              </div>
            )}
          </div>

          {/* ==================================================
              PROJECT INFORMATION
          ================================================== */}

          <aside>
            <div className="sticky top-8 rounded-[22px] bg-white p-6 shadow-[0_20px_60px_rgba(0,0,0,0.06)]">
              <div className="mb-6">
                <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#bd9650]">
                  Project Information
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Spesifikasi
                </h2>
              </div>

              <div className="divide-y divide-black/10">
                <InfoRow
                  label="Client"
                  value={project.client}
                />

                <InfoRow
                  label="Lokasi"
                  value={project.location}
                />

                <InfoRow
                  label="Kategori"
                  value={project.category}
                />

                <InfoRow
                  label="Luas Area"
                  value={project.area}
                />

                <InfoRow
                  label="Struktur"
                  value={project.structure}
                />

                <InfoRow
                  label="Membrane"
                  value={project.membrane}
                />

                <InfoRow
                  label="Tanggal Selesai"
                  value={formattedCompletionDate}
                />
              </div>

              {/* ==================================================
                  CTA
              ================================================== */}

              <div className="mt-7">
                <p className="text-xs leading-5 text-[#66635c]">
                  Punya kebutuhan struktur atau membrane
                  untuk project Anda?
                </p>

                <a
                  href="/#kontak"
                  className="mt-4 flex h-11 w-full items-center justify-center rounded-full bg-[#171717] px-5 text-xs font-semibold !text-white transition hover:bg-[#bd9650] hover:!text-white"
                >
                  Konsultasi Project
                </a>
              </div>
            </div>
          </aside>
        </div>
      </section>

      {/* ======================================================
          BOTTOM CTA
      ====================================================== */}

      <section className="border-t border-black/10 bg-[#e9e5dc]">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-6 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-16">
          <div>
            <p className="text-[9px] font-medium uppercase tracking-[0.3em] text-[#8f6d35]">
              Portfolio
            </p>

            <a
              href="/projects"
              className="mt-2 inline-block text-sm font-medium text-[#171717] transition hover:text-[#bd9650]"
            >
              Lihat project lainnya →
            </a>
          </div>

          <a
            href="/projects"
            className="text-xs font-medium text-[#171717] transition hover:text-[#bd9650]"
          >
            Kembali ke Project
          </a>
        </div>
      </section>
    </main>
  );
}

/* =============================================================
   INFO ROW
============================================================= */

function InfoRow({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-3">
      <span className="text-[10px] text-[#99958b]">
        {label}
      </span>

      <span className="text-right text-[11px] font-medium text-[#292824]">
        {value || "-"}
      </span>
    </div>
  );
}