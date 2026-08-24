import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getProjects() {
  const projects = await prisma.project.findMany({
    where: {
      published: true,
    },
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
    include: {
      medias: {
        include: {
          media: true,
        },
        orderBy: {
          sortOrder: "asc",
        },
      },
    },
  });

  return projects;
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}

      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gold">
            PORTFOLIO
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Selected Projects
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
            Kumpulan project membrane, canopy, tensile structure, dan struktur
            lainnya yang dikerjakan oleh Duta Karya Membrane.
          </p>
        </div>
      </section>

      {/* =====================================================
          PROJECT LIST
      ===================================================== */}

      <section className="bg-warmWhite py-20">
        <div className="max-width-1440 mx-auto px-6">
          {projects.length === 0 ? (
            <div className="rounded-card border border-gray-200 bg-white px-6 py-20 text-center">
              <p className="text-sm font-medium text-charcoal">
                Belum ada project yang tersedia.
              </p>

              <p className="mt-2 text-xs text-mutedText">
                Project yang sudah dipublikasikan akan muncul di halaman ini.
              </p>
            </div>
          ) : (
            <div className="mb-12 grid grid-cols-1 gap-8 md:grid-cols-2">
              {projects.map((project) => {
                const coverMedia =
                  project.medias.find(
                    (projectMedia) => projectMedia.isCover
                  )?.media ??
                  project.medias[0]?.media ??
                  null;

                return (
                  <article
                    key={project.id}
                    className="flex flex-col justify-between overflow-hidden rounded-card border border-gray-100 bg-white card-shadow transition-all hover:border-gold"
                  >
                    {/* =================================================
                        PROJECT IMAGE
                    ================================================= */}

                    <Link
                      href={`/projects/${project.slug}`}
                      className="group block"
                    >
                      <div className="relative aspect-[16/10] overflow-hidden bg-gray-200">
                        {coverMedia ? (
                          coverMedia.type === "VIDEO" ? (
                            <video
                              src={coverMedia.url}
                              muted
                              playsInline
                              preload="metadata"
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          ) : (
                            <img
                              src={coverMedia.url}
                              alt={coverMedia.altText || project.title}
                              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          )
                        ) : project.ogImage ? (
                          <img
                            src={project.ogImage}
                            alt={project.title}
                            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="flex h-full w-full items-center justify-center bg-charcoal">
                            <div className="text-center">
                              <span className="block text-[10px] font-bold uppercase tracking-[0.3em] text-gold">
                                Duta Karya Membrane
                              </span>

                              <span className="mt-2 block text-xs text-white/50">
                                Project Image
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Featured badge */}

                        {project.featured && (
                          <div className="absolute left-4 top-4 rounded-full bg-charcoal px-3 py-1.5 text-[9px] font-bold uppercase tracking-[0.15em] text-white">
                            Featured
                          </div>
                        )}
                      </div>
                    </Link>

                    {/* =================================================
                        PROJECT CONTENT
                    ================================================= */}

                    <div className="p-8">
                      <span className="mb-2 block text-[10px] font-bold uppercase tracking-wider text-gold">
                        {project.category || "Project"}
                      </span>

                      <h3 className="mb-3 text-xl font-bold text-charcoal">
                        {project.title}
                      </h3>

                      <p className="mb-6 text-xs leading-relaxed text-mutedText">
                        {project.description}
                      </p>

                      {/* =================================================
                          PROJECT META
                      ================================================= */}

                      <div className="mb-6 grid grid-cols-2 gap-4 border-t border-gray-100 pt-4 text-xs">
                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Lokasi
                          </p>

                          <p className="font-medium text-charcoal">
                            {project.location || "-"}
                          </p>
                        </div>

                        <div>
                          <p className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                            Luas Area
                          </p>

                          <p className="font-medium text-charcoal">
                            {project.area || "-"}
                          </p>
                        </div>
                      </div>

                      {/* =================================================
                          DETAIL BUTTON
                      ================================================= */}

                      <Link
                        href={`/projects/${project.slug}`}
                        className="block"
                      >
                        <Button
                          variant="outline"
                          className="w-full"
                        >
                          Lihat Detail Proyek →
                        </Button>
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}