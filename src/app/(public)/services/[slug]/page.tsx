import Link from "next/link";
import { notFound } from "next/navigation";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { prisma } from "@/lib/prisma";

type ServiceDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

async function getService(slug: string) {
  const service = await prisma.service.findUnique({
    where: {
      slug,
    },
  });

  if (!service || !service.published) {
    return null;
  }

  return service;
}

export async function generateMetadata({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;

  const service = await getService(slug);

  if (!service) {
    return {
      title: "Service Tidak Ditemukan | Duta Karya Membrane",
    };
  }

  return {
    title: `${service.title} | Duta Karya Membrane`,
    description: service.description,
  };
}

export default async function ServiceDetailPage({
  params,
}: ServiceDetailPageProps) {
  const { slug } = await params;

  const service = await getService(slug);

  if (!service) {
    notFound();
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Header />

      {/* =====================================================
          HERO
      ===================================================== */}
      <section className="bg-charcoal py-16 text-white md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <Link
            href="/services"
            className="mb-8 inline-flex items-center text-xs font-medium !text-white/70 transition-colors hover:!text-[#b8893c]"
          >
            ← Kembali ke Layanan
          </Link>

          <span className="mb-3 block text-xs font-bold uppercase tracking-wider text-gold">
            LAYANAN KAMI
          </span>

          <h1 className="max-w-4xl text-4xl font-extrabold tracking-tight !text-white md:text-6xl">
            {service.title}
          </h1>

          <p className="mt-6 max-w-2xl text-sm leading-7 !text-white/70 md:text-base">
            {service.description}
          </p>
        </div>
      </section>

      {/* =====================================================
          SERVICE DETAIL
      ===================================================== */}
      <main className="flex-1 bg-warmWhite">
        <section className="py-16 md:py-20">
          <div className="max-width-1440 mx-auto px-6">
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
              {/* =================================================
                  MAIN CONTENT
              ================================================= */}
              <article className="rounded-card border border-gray-100 bg-white p-8 card-shadow md:p-10">
                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  DETAIL LAYANAN
                </span>

                <h2 className="text-2xl font-bold text-charcoal md:text-3xl">
                  {service.title}
                </h2>

                <div className="mt-6 h-px w-full bg-gray-100" />

                <div className="mt-8">
                  <p className="text-sm leading-8 text-mutedText">
                    {service.description}
                  </p>

                  <p className="mt-6 text-sm leading-8 text-mutedText">
                    Duta Karya Membrane menyediakan solusi struktur dan
                    membrane yang disesuaikan dengan kebutuhan setiap proyek,
                    mulai dari tahap perencanaan hingga proses pengerjaan.
                  </p>
                </div>
              </article>

              {/* =================================================
                  SIDEBAR
              ================================================= */}
              <aside className="h-fit rounded-card border border-gray-100 bg-white p-8 card-shadow">
                <span className="mb-3 block text-[10px] font-bold uppercase tracking-[0.25em] text-gold">
                  SERVICE INFORMATION
                </span>

                <h2 className="text-xl font-bold text-charcoal">
                  Informasi Layanan
                </h2>

                <div className="mt-6 divide-y divide-gray-100">
                  <div className="flex items-center justify-between gap-4 py-4 text-xs">
                    <span className="text-gray-400">
                      Nama Service
                    </span>

                    <span className="text-right font-medium text-charcoal">
                      {service.title}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4 text-xs">
                    <span className="text-gray-400">
                      Kategori
                    </span>

                    <span className="text-right font-medium text-charcoal">
                      Duta Karya Membrane
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-4 py-4 text-xs">
                    <span className="text-gray-400">
                      Status
                    </span>

                    <span className="font-medium text-charcoal">
                      Published
                    </span>
                  </div>
                </div>

                {/* =================================================
                    CONSULTATION BUTTON
                ================================================= */}
                <div className="mt-6">
                  <Link
                    href="/#contact"
                    className="flex w-full items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-xs font-bold !text-white transition-colors hover:bg-[#b8893c] hover:!text-white"
                  >
                    <span className="!text-white">
                      Konsultasi Project
                    </span>
                  </Link>
                </div>
              </aside>
            </div>
          </div>
        </section>

        {/* =====================================================
            BACK TO SERVICES
        ===================================================== */}
        <section className="border-t border-gray-200 bg-[#e9e6de] py-10">
          <div className="max-width-1440 mx-auto px-6">
            <Link
              href="/services"
              className="text-xs font-medium !text-charcoal transition-colors hover:!text-[#b8893c]"
            >
              ← Lihat Semua Layanan
            </Link>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}