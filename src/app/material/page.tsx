import Image from "next/image";

const materials = [
  {
    number: "01",
    title: "PVC Coated Polyester",
    subtitle: "PVC COATED POLYESTER",
    description:
      "Material polyester yang dilapisi PVC untuk kebutuhan struktur membrane, tenda, dan struktur tensile.",
    applications: [
      "Kanopi Parkir",
      "Tenda Event",
      "Stadion",
      "Aula & Gedung",
    ],
  },
  {
    number: "02",
    title: "PVC + PVDF",
    subtitle: "PVDF LACQUERED",
    description:
      "Material PVC dengan lapisan PVDF untuk memberikan perlindungan permukaan dan ketahanan yang lebih baik.",
    applications: [
      "Kanopi Premium",
      "Stadion",
      "Resort",
      "Atrium",
    ],
  },
  {
    number: "03",
    title: "PTFE Coated Fiberglass",
    subtitle: "PTFE COATED FIBERGLASS",
    description:
      "Kain fiberglass dengan lapisan PTFE untuk aplikasi struktur dengan kebutuhan ketahanan dan umur pakai yang tinggi.",
    applications: [
      "Stadion",
      "Airport",
      "Terminal",
      "Struktur Besar",
    ],
  },
  {
    number: "04",
    title: "ETFE Film",
    subtitle: "ETFE FILM",
    description:
      "Material film transparan dan ringan yang dapat digunakan untuk kebutuhan struktur dengan karakter visual modern.",
    applications: [
      "Stadion",
      "Atrium",
      "Mall",
      "Botanical Garden",
    ],
  },
  {
    number: "05",
    title: "HDPE Shade Fabric",
    subtitle: "HDPE SHADE FABRIC",
    description:
      "Material shade fabric yang ringan dan fleksibel untuk kebutuhan perlindungan area dari panas matahari.",
    applications: [
      "Shade Sail",
      "Parkiran",
      "Playground",
      "Taman",
    ],
  },
  {
    number: "06",
    title: "Acrylic Coated Polyester",
    subtitle: "ACRYLIC COATED POLYESTER",
    description:
      "Polyester dengan lapisan acrylic untuk kebutuhan awning, tenda, dan struktur ringan dengan tampilan menarik.",
    applications: [
      "Awning",
      "Tenda",
      "Kanopi Rumah",
      "Payung",
    ],
  },
  {
    number: "07",
    title: "AGTEX",
    subtitle: "PVC COATED POLYESTER",
    description:
      "Material membrane berbasis polyester dengan lapisan PVC untuk kebutuhan struktur membrane dan tensile.",
    applications: [
      "Kanopi Membrane",
      "Stadion",
      "Indonesia Project",
      "Rooftop",
    ],
  },
  {
    number: "08",
    title: "HEYtex",
    subtitle: "PVC COATED POLYESTER",
    description:
      "Material produksi teknologi tekstil global yang dapat digunakan untuk kebutuhan aplikasi arsitektural dan struktur tensile.",
    applications: [
      "Kanopi Parkir",
      "Tenda Besar",
      "Area",
      "Struktur Membrane",
    ],
  },
];

const comparison = [
  {
    material: "PVC Coated Polyester",
    uv: "★★★★",
    waterproof: "★★★★★",
    flexible: "★★★★",
    price: "$$",
    lifespan: "8–15 Tahun",
  },
  {
    material: "PVC + PVDF",
    uv: "★★★★★",
    waterproof: "★★★★★",
    flexible: "★★★★",
    price: "$$$",
    lifespan: "10–20 Tahun",
  },
  {
    material: "PTFE Fiberglass",
    uv: "★★★★★",
    waterproof: "★★★★★",
    flexible: "★★★",
    price: "$$$$",
    lifespan: "20–30 Tahun",
  },
  {
    material: "ETFE Film",
    uv: "★★★★★",
    waterproof: "★★★★★",
    flexible: "★★★★",
    price: "$$$$",
    lifespan: "25–35 Tahun",
  },
  {
    material: "HDPE Shade Fabric",
    uv: "★★★★",
    waterproof: "★★★",
    flexible: "★★",
    price: "$",
    lifespan: "5–10 Tahun",
  },
  {
    material: "Acrylic Polyester",
    uv: "★★★★★",
    waterproof: "★★★★",
    flexible: "★★★★",
    price: "$$",
    lifespan: "5–8 Tahun",
  },
];

const selectionGuide = [
  {
    number: "01",
    title: "Untuk Premium",
    material: "PTFE Coated Fiberglass",
    description:
      "Pilihan untuk proyek yang membutuhkan performa tinggi dan umur pakai panjang.",
  },
  {
    number: "02",
    title: "Untuk Struktur Umum",
    material: "PVC + PVDF",
    description:
      "Pilihan untuk proyek yang membutuhkan keseimbangan performa, estetika, dan ketahanan.",
  },
  {
    number: "03",
    title: "Untuk Transparansi",
    material: "ETFE Film",
    description:
      "Pilihan ketika pencahayaan alami dan karakter visual transparan menjadi prioritas.",
  },
  {
    number: "04",
    title: "Untuk Ekonomis",
    material: "HDPE Shade Fabric",
    description:
      "Pilihan untuk kebutuhan peneduh dengan pendekatan yang lebih ekonomis.",
  },
];

export default function MaterialPage() {
  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">
      {/* HEADER */}
      <header className="sticky top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/95 backdrop-blur-md">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-14">
          <a
            href="/"
            className="flex shrink-0 items-center"
            aria-label="Duta Karya Membrane"
          >
            <Image
              src="/images/logo-dkm.png"
              alt="Duta Karya Membrane"
              width={72}
              height={72}
              priority
              className="h-[72px] w-[72px] object-contain"
            />
          </a>

          <nav className="hidden items-center gap-8 text-sm md:flex">
            <a
              href="/#about"
              className="text-[#171717] transition-colors duration-300 hover:text-[#b89452]"
            >
              Tentang
            </a>

            <a
              href="/#services"
              className="text-[#171717] transition-colors duration-300 hover:text-[#b89452]"
            >
              Layanan
            </a>

            <a
              href="/material"
              className="font-medium text-[#b89452]"
            >
              Material
            </a>

            <a
              href="/#projects"
              className="text-[#171717] transition-colors duration-300 hover:text-[#b89452]"
            >
              Proyek
            </a>

            <a
              href="/#process"
              className="text-[#171717] transition-colors duration-300 hover:text-[#b89452]"
            >
              Proses
            </a>

            <a
              href="/#contact"
              className="text-[#171717] transition-colors duration-300 hover:text-[#b89452]"
            >
              Kontak
            </a>
          </nav>

          <a
            href="/kontak"
            className="inline-flex items-center justify-center rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#b89452]"
          >
            Konsultasi
          </a>
        </div>
      </header>

      {/* HERO */}
      <section className="mx-auto max-w-[1440px] px-6 pb-20 pt-24 md:px-10 md:pb-28 md:pt-32 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              Material Guide
            </p>

            <h1 className="mt-5 max-w-3xl text-5xl font-semibold leading-[0.95] tracking-[-0.05em] md:text-7xl">
              Canopy
              <br />
              <span className="text-[#8d8982]">& membrane.</span>
            </h1>

            <div className="my-7 h-[3px] w-16 bg-[#b89452]" />

            <p className="max-w-xl text-base leading-7 text-[#68645d]">
              Mengenal berbagai jenis material yang dapat digunakan untuk
              kebutuhan canopy, membrane, tensile structure, dan struktur
              arsitektural.
            </p>
          </div>

          <div className="relative overflow-hidden rounded-[28px] bg-[#171717]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_70%_20%,rgba(184,148,82,0.3),transparent_42%),linear-gradient(135deg,#171716,#292722)]" />

            <div className="relative z-10 grid min-h-[360px] place-items-center px-8 py-14 text-center">
              <div>
                <p className="text-xs uppercase tracking-[0.3em] text-[#c9a25b]">
                  Duta Karya Membrane
                </p>

                <h2 className="mt-5 text-4xl font-medium leading-tight text-white md:text-5xl">
                  Material
                  <br />
                  Matters.
                </h2>

                <p className="mx-auto mt-5 max-w-md text-sm leading-6 text-white/55">
                  Pemilihan material yang tepat membantu menentukan performa,
                  estetika, ketahanan, dan karakter akhir sebuah struktur.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT LIST */}
      <section className="bg-[#ebe8e1] px-6 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="mb-14">
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              Daftar Material
            </p>

            <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Pilih material.
              <br />
              <span className="text-[#8d8982]">Bangun dengan tepat.</span>
            </h2>
          </div>

          <div className="grid overflow-hidden rounded-[28px] border border-black/10 bg-[#f7f5f0] md:grid-cols-2">
            {materials.map((material) => (
              <article
                key={material.number}
                className="group border-b border-black/10 p-7 transition-colors duration-300 hover:bg-white md:p-10 md:even:border-l"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-sm font-medium text-[#b89452]">
                    {material.number}
                  </span>

                  <span className="text-xl text-[#aaa49a] transition-transform duration-300 group-hover:-translate-y-1 group-hover:translate-x-1">
                    ↗
                  </span>
                </div>

                <h3 className="mt-14 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                  {material.title}
                </h3>

                <p className="mt-2 text-xs font-semibold uppercase tracking-[0.16em] text-[#b89452]">
                  {material.subtitle}
                </p>

                <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736c]">
                  {material.description}
                </p>

                <div className="mt-8 border-t border-black/10 pt-6">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-[#8d8982]">
                    Aplikasi
                  </p>

                  <div className="mt-4 flex flex-wrap gap-2">
                    {material.applications.map((application) => (
                      <span
                        key={application}
                        className="rounded-full border border-black/10 bg-white px-3 py-2 text-xs text-[#68645d]"
                      >
                        {application}
                      </span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* COMPARISON */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              Comparison
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Perbandingan
              <br />
              <span className="text-[#8d8982]">material.</span>
            </h2>

            <p className="mt-6 max-w-md text-sm leading-7 text-[#77736c]">
              Gunakan perbandingan ini sebagai gambaran awal sebelum menentukan
              material berdasarkan kebutuhan proyek.
            </p>
          </div>

          <div className="overflow-x-auto rounded-[24px] border border-black/10 bg-white">
            <table className="w-full min-w-[760px] border-collapse text-left">
              <thead>
                <tr className="border-b border-black/10 bg-[#f7f5f0]">
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    Material
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    UV
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    Water
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    Flexible
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    Harga
                  </th>
                  <th className="px-5 py-4 text-xs font-semibold uppercase tracking-[0.12em]">
                    Umur
                  </th>
                </tr>
              </thead>

              <tbody>
                {comparison.map((item) => (
                  <tr
                    key={item.material}
                    className="border-b border-black/10 last:border-0"
                  >
                    <td className="px-5 py-5 text-sm font-medium">
                      {item.material}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#b89452]">
                      {item.uv}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#b89452]">
                      {item.waterproof}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#b89452]">
                      {item.flexible}
                    </td>

                    <td className="px-5 py-5 text-sm">
                      {item.price}
                    </td>

                    <td className="px-5 py-5 text-sm text-[#68645d]">
                      {item.lifespan}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SELECTION GUIDE */}
      <section className="bg-[#171717] px-6 py-24 text-white md:px-10 md:py-32 lg:px-14">
        <div className="mx-auto max-w-[1440px]">
          <div className="grid gap-14 lg:grid-cols-[0.65fr_1.35fr]">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#c9a25b]">
                Material Selection
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Material yang
                <br />
                <span className="text-white/40">tepat untuk proyek.</span>
              </h2>

              <p className="mt-7 max-w-md text-sm leading-7 text-white/50">
                Setiap proyek memiliki kebutuhan yang berbeda. Pemilihan
                material perlu mempertimbangkan fungsi, lokasi, desain,
                lingkungan, dan target umur pakai.
              </p>
            </div>

            <div className="grid border-t border-white/10 md:grid-cols-2">
              {selectionGuide.map((item) => (
                <div
                  key={item.number}
                  className="border-b border-white/10 py-8 md:px-8 md:first:border-r"
                >
                  <span className="text-sm font-medium text-[#c9a25b]">
                    {item.number}
                  </span>

                  <h3 className="mt-6 text-2xl font-medium">
                    {item.title}
                  </h3>

                  <p className="mt-2 text-lg text-[#c9a25b]">
                    {item.material}
                  </p>

                  <p className="mt-4 max-w-md text-sm leading-6 text-white/45">
                    {item.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* FINAL CTA */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-14">
        <div className="rounded-[28px] bg-[#ebe8e1] px-7 py-12 md:px-12 md:py-16 lg:px-16">
          <div className="flex flex-col justify-between gap-10 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                Need Help?
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
                Belum yakin memilih
                <br />
                material?
              </h2>

              <p className="mt-5 max-w-xl text-sm leading-7 text-[#77736c]">
                Konsultasikan kebutuhan proyek Anda bersama tim Duta Karya
                Membrane untuk mendapatkan rekomendasi material yang sesuai.
              </p>
            </div>

            <a
              href="/kontak"
              className="inline-flex shrink-0 items-center justify-center rounded-full bg-[#171717] px-7 py-4 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-1 hover:bg-[#b89452]"
            >
              Konsultasi →
            </a>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-black/10 bg-[#f7f5f0]">
        <div className="mx-auto flex max-w-[1440px] flex-col justify-between gap-6 px-6 py-8 text-sm text-[#77736c] md:flex-row md:px-10 lg:px-14">
          <p>© {new Date().getFullYear()} Duta Karya Membrane.</p>

          <div className="flex gap-6">
            <a
              href="/"
              className="transition-colors hover:text-[#b89452]"
            >
              Homepage
            </a>

            <a
              href="/kontak"
              className="transition-colors hover:text-[#b89452]"
            >
              Konsultasi
            </a>
          </div>
        </div>
      </footer>
    </main>
  );
}