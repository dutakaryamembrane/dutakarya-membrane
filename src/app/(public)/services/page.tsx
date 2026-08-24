import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { prisma } from "@/lib/prisma";

export default async function ServicesPage() {
  const services = await prisma.service.findMany({
    where: {
      published: true,
    },
    orderBy: [
      {
        sortOrder: "asc",
      },
      {
        createdAt: "asc",
      },
    ],
  });

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <span className="mb-2 block text-xs font-bold uppercase tracking-wider text-gold">
            LAYANAN KAMI
          </span>

          <h1 className="text-3xl font-extrabold tracking-tight text-white md:text-5xl">
            Produk &amp; Jasa Duta Karya
          </h1>

          <p className="mt-5 max-w-2xl text-sm leading-7 text-white/60">
            Solusi membrane, canopy, tensile structure, dan berbagai kebutuhan
            struktur untuk proyek komersial, publik, maupun hunian.
          </p>
        </div>
      </section>

      {/* =====================================================
          SERVICE LIST
      ===================================================== */}
      <section className="bg-warmWhite py-20">
        <div className="max-width-1440 mx-auto px-6">
          {services.length === 0 ? (
            <div className="rounded-card border border-gray-200 bg-white px-6 py-20 text-center">
              <p className="text-sm font-medium text-charcoal">
                Belum ada layanan yang tersedia.
              </p>

              <p className="mt-2 text-xs text-mutedText">
                Layanan yang sudah dipublikasikan akan muncul di halaman ini.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {services.map((service, index) => (
                <Link
                  key={service.id}
                  href={`/services/${service.slug}`}
                  className="group"
                >
                  <article className="flex h-56 flex-col justify-between rounded-card border border-gray-100 bg-white p-8 card-shadow transition-all duration-300 hover:-translate-y-1 hover:border-gold">
                    <div>
                      <span className="mb-4 block text-[10px] font-extrabold tracking-widest text-gold">
                        {String(index + 1).padStart(2, "0")}
                      </span>

                      <h2 className="mb-2 text-base font-bold text-charcoal transition-colors group-hover:text-gold">
                        {service.title}
                      </h2>

                      <p className="text-xs leading-relaxed text-mutedText">
                        {service.description}
                      </p>
                    </div>

                    <div className="mt-4 flex justify-end">
                      <span className="text-lg font-bold text-gold transition-transform duration-300 group-hover:translate-x-1">
                        →
                      </span>
                    </div>
                  </article>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      <Footer />
    </div>
  );
}