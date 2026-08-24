import Link from "next/link";
import { Header } from "@/components/ui/Header";
import { prisma } from "@/lib/prisma";

const services = [
  {
    number: "01",
    title: "Membrane",
    description:
      "Pembuatan dan pemasangan struktur membrane dengan desain yang disesuaikan dengan kebutuhan ruang.",
  },
  {
    number: "02",
    title: "Tensile Structure",
    description:
      "Solusi tensile structure untuk area komersial, publik, maupun hunian dengan pendekatan custom.",
  },
  {
    number: "03",
    title: "Canopy",
    description:
      "Canopy modern untuk melindungi area sekaligus memberikan karakter arsitektur yang kuat.",
  },
  {
    number: "04",
    title: "Steel Structure",
    description:
      "Pengerjaan struktur baja dengan fokus pada kekuatan, ketepatan konstruksi, dan kebutuhan proyek.",
  },
];


const materials = [
  {
    number: "01",
    title: "PVC Coated Polyester",
    description:
      "Material membrane yang fleksibel, ekonomis, dan cocok untuk berbagai kebutuhan kanopi serta struktur tensile.",
    features: ["Tahan air", "Tahan UV", "Fleksibel", "Ekonomis"],
    applications: ["Kanopi Parkir", "Tenda Event", "Stadion", "Aula & Gedung"],
  },
  {
    number: "02",
    title: "PVC + PVDF",
    description:
      "Material PVC dengan lapisan PVDF untuk perlindungan permukaan yang lebih baik dan daya tahan jangka panjang.",
    features: ["Tahan UV lebih tinggi", "Warna lebih awet", "Permukaan mudah dibersihkan", "Tahan kotoran & jamur"],
    applications: ["Kanopi Premium", "Stadion", "Resort", "Atrium"],
  },
  {
    number: "03",
    title: "PTFE Coated Fiberglass",
    description:
      "Material fiberglass berlapis PTFE untuk kebutuhan struktur dengan ketahanan cuaca dan umur pakai yang panjang.",
    features: ["Ketahanan UV sangat tinggi", "Tahan suhu ekstrem", "Tidak mudah kotor", "Stabilitas dimensi tinggi"],
    applications: ["Stadion", "Airport", "Terminal", "Struktur Besar"],
  },
  {
    number: "04",
    title: "ETFE Film",
    description:
      "Film transparan dan ringan dengan bobot rendah, cocok untuk kebutuhan arsitektur yang membutuhkan cahaya alami.",
    features: ["Transparan & ringan", "Tahan UV", "Tahan bahan kimia", "Umur pakai panjang"],
    applications: ["Stadion", "Atrium", "Mall", "Botanical Garden"],
  },
  {
    number: "05",
    title: "HDPE Shade Fabric",
    description:
      "Material shade fabric untuk area teduh dengan sirkulasi udara yang baik dan karakter yang ringan.",
    features: ["Sirkulasi udara baik", "Ringan & fleksibel", "Tahan UV", "Beragam tingkat kerapatan"],
    applications: ["Shade Sail", "Parkiran", "Playground", "Taman"],
  },
  {
    number: "06",
    title: "Acrylic Coated Polyester",
    description:
      "Polyester dengan lapisan acrylic untuk aplikasi outdoor yang membutuhkan warna menarik dan perlindungan cuaca.",
    features: ["Warna menarik", "Tahan UV", "Tahan air", "Fleksibel"],
    applications: ["Awning", "Tenda", "Kanopi Rumah", "Payung"],
  },
  {
    number: "07",
    title: "AGTEX (PVC Coated Polyester)",
    description:
      "Material membrane berbasis polyester dengan lapisan PVC untuk kebutuhan struktur membrane dengan performa tinggi.",
    features: ["Tahan cuaca & UV", "Kekuatan tarik tinggi", "Tahan sobek", "Berbagai pilihan gramasi"],
    applications: ["Kanopi Membrane", "Stadion", "Indonesia Project", "Rooftop"],
  },
  {
    number: "08",
    title: "HEYTex (PVC Coated Polyester)",
    description:
      "Material PVC coated polyester dengan pilihan performa untuk berbagai kebutuhan struktur membrane dan arsitektur.",
    features: ["Coating PVC berkualitas", "Stabilitas dimensi", "Tahan UV & cuaca", "Cocok untuk struktur tensile"],
    applications: ["Kanopi Parkir", "Tenda Besar", "Area", "Struktur Membrane"],
  },
];

const materialComparison = [
  ["PVC Coated Polyester", "★★★★", "★★★★", "★★★★", "$$"],
  ["PVC + PVDF", "★★★★★", "★★★★★", "★★★★★", "$$$"],
  ["PTFE Fiberglass", "★★★★★", "★★★★★", "★★★★★", "$$$$"],
  ["ETFE Film", "★★★★★", "★★★★", "★★★★★", "$$$$"],
  ["HDPE Shade Fabric", "★★★★", "★★★★", "★★", "$"],
  ["Acrylic Polyester", "★★★★", "★★★★", "★★★", "$$"],
];

const highlights = [
  {
    value: "2020",
    label: "Established",
  },
  {
    value: "Bandung",
    label: "Based in Indonesia",
  },
  {
    value: "Custom",
    label: "Design & Fabrication",
  },
  {
    value: "End-to-end",
    label: "Installation Service",
  },
];

const process = [
  {
    number: "01",
    title: "Consultation",
    description:
      "Memahami kebutuhan, lokasi, fungsi ruang, dan karakter visual yang diinginkan.",
  },
  {
    number: "02",
    title: "Design",
    description:
      "Mengembangkan konsep dan solusi struktur yang sesuai dengan kebutuhan proyek.",
  },
  {
    number: "03",
    title: "Fabrication",
    description:
      "Proses produksi dilakukan dengan memperhatikan detail material dan kebutuhan konstruksi.",
  },
  {
    number: "04",
    title: "Installation",
    description:
      "Instalasi di lokasi hingga proyek siap digunakan.",
  },
];

export default async function HomePage() {
  const projects = await prisma.project.findMany({
    where: {
      published: true,
    },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      location: true,
      category: true,
      featured: true,
      ogImage: true,
      sortOrder: true,
      createdAt: true,

      // FOTO PROJECT
      medias: {
        orderBy: {
          sortOrder: "asc",
        },
        select: {
          isCover: true,
          sortOrder: true,
          media: true,
        },
      },
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

    take: 6,
  });

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">

      {/* ===================================================== */}
      {/* HEADER */}
      {/* ===================================================== */}

      <Header />

      {/* ===================================================== */}
      {/* HERO */}
      {/* ===================================================== */}

      <section
        id="home"
        className="mx-auto max-w-[1440px] px-6 pb-20 pt-36 md:px-10 md:pb-28 md:pt-44 lg:px-14"
      >
        <div className="grid gap-12 lg:grid-cols-[1.15fr_0.85fr] lg:items-end">
          <div>
            <div className="mb-8 flex items-center gap-3 text-xs font-medium uppercase tracking-[0.22em] text-[#77736c]">
              <span className="h-px w-10 bg-[#b89452]" />
              Membrane · Tensile · Canopy · Steel
            </div>

            <h1 className="max-w-5xl text-[clamp(3.5rem,8vw,8rem)] font-semibold leading-[0.88] tracking-[-0.07em]">
              Structures
              <br />
              that shape
              <br />
              <span className="text-[#b89452]">your space.</span>
            </h1>
          </div>

          <div className="max-w-xl lg:pb-2">
            <p className="text-lg leading-8 text-[#5f5b55] md:text-xl">
              Solusi pembuatan dan pemasangan membrane, tensile structure,
              canopy, dan struktur baja untuk hunian, bisnis, dan ruang publik.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">

              {/* HERO PRIMARY BUTTON */}
              <a
                href="#contact"
                className="inline-flex items-center justify-center rounded-full bg-[#171717] px-7 py-3.5 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#2a2a2a]"
              >
                Konsultasi Proyek
              </a>

              {/* HERO OUTLINE BUTTON */}
              <a
                href="#projects"
                className="inline-flex items-center justify-center rounded-full border border-[#171717]/20 bg-white px-7 py-3.5 text-sm font-semibold !text-[#171717] transition-all duration-300 hover:bg-[#171717] hover:!text-white"
              >
                Lihat Portofolio
              </a>

            </div>
          </div>
        </div>

        {/* ===================================================== */}
        {/* HERO VISUAL */}
        {/* ===================================================== */}

        <div className="mt-16 overflow-hidden rounded-[2rem] bg-[#20201e] md:mt-20">
          <div className="relative min-h-[430px] overflow-hidden md:min-h-[560px]">

            <img
              src="/images/canopy.png"
              alt="Canopy membrane Duta Karya Membrane"
              className="absolute inset-0 h-full w-full object-cover"
            />

            <div className="absolute left-[8%] top-[18%] h-px w-[75%] rotate-[12deg] bg-[#b89452]/70" />

            <div className="absolute left-[15%] top-[42%] h-px w-[68%] rotate-[-16deg] bg-white/20" />

            <div className="absolute bottom-[22%] right-[10%] h-px w-[55%] rotate-[22deg] bg-white/20" />

            {/* =================================================
                HERO TEXT + FEATURES
            ================================================= */}

            <div className="absolute inset-y-0 left-0 flex w-full max-w-[52%] flex-col justify-center px-7 py-10 text-white md:px-10 lg:px-12">

              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#b89452]">
                Duta Karya Membrane
              </p>

              <h2 className="mt-5 max-w-md text-4xl font-medium leading-[0.95] tracking-[-0.05em] md:text-5xl lg:text-6xl">
                Built for
                <br />
                structure.
              </h2>

              {/* GOLD LINE UNDER TITLE */}
              <div className="mt-7 h-1 w-14 bg-[#b89452]" />

              <p className="mt-6 max-w-md text-sm leading-6 text-white/70 md:text-base md:leading-7">
                Solusi kanopi membrane berkualitas tinggi dengan desain modern,
                kekuatan struktur terbaik, dan daya tahan untuk jangka panjang.
              </p>

              {/* =================================================
                  GOLD FEATURE ICONS
              ================================================= */}

              <div className="mt-8 grid max-w-xl grid-cols-3 gap-4 md:mt-10 md:gap-6">

                {/* FEATURE 01 */}
                <div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-[#b89452]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M12 3 19 6v5c0 4.8-2.9 8.4-7 10-4.1-1.6-7-5.2-7-10V6l7-3Z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>

                  <h3 className="mt-3 text-xs font-semibold md:text-sm">
                    Kuat &amp; Tahan
                    <br />
                    Lama
                  </h3>

                  <p className="mt-2 text-[10px] leading-4 text-white/50 md:text-xs md:leading-5">
                    Material premium dengan daya tahan tinggi.
                  </p>
                </div>

                {/* FEATURE 02 */}
                <div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-[#b89452]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="m12 3 8 4.5v9L12 21l-8-4.5v-9L12 3Z" />
                    <path d="m4 7.5 8 4.5 8-4.5M12 12v9" />
                  </svg>

                  <h3 className="mt-3 text-xs font-semibold md:text-sm">
                    Desain Modern
                  </h3>

                  <p className="mt-2 text-[10px] leading-4 text-white/50 md:text-xs md:leading-5">
                    Estetika elegan yang menyatu dengan berbagai konsep.
                  </p>
                </div>

                {/* FEATURE 03 */}
                <div>
                  <svg
                    aria-hidden="true"
                    viewBox="0 0 24 24"
                    className="h-7 w-7 text-[#b89452]"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                  >
                    <path d="M7 18h10.5a3.5 3.5 0 0 0 .6-6.95A6 6 0 0 0 6.4 9.4 4.3 4.3 0 0 0 7 18Z" />
                    <path d="M12 3v3M5.6 5.6l2.1 2.1M18.4 5.6l-2.1 2.1" />
                  </svg>

                  <h3 className="mt-3 text-xs font-semibold md:text-sm">
                    Tahan Cuaca
                    <br />
                    Ekstrem
                  </h3>

                  <p className="mt-2 text-[10px] leading-4 text-white/50 md:text-xs md:leading-5">
                    Perlindungan optimal dari panas, hujan, dan angin.
                  </p>
                </div>

              </div>
            </div>

            {/* =================================================
                HERO LOCATION
            ================================================= */}

            <div className="absolute bottom-8 right-8 text-sm text-white/60 md:bottom-10 md:right-10">
              Bandung · Indonesia
            </div>

          </div>
        </div>
      </section>

      {/* ===================================================== */}
      {/* HIGHLIGHTS */}
      {/* ===================================================== */}

      <section className="border-y border-black/10 bg-[#171717] text-white">
        <div className="mx-auto grid max-w-[1440px] md:grid-cols-4">
          {highlights.map((item) => (
            <div
              key={item.label}
              className="border-b border-white/10 px-6 py-8 last:border-b-0 md:border-b-0 md:border-r md:px-10 md:py-12 md:last:border-r-0 lg:px-14"
            >
              <p className="text-2xl font-medium tracking-tight md:text-3xl">
                {item.value}
              </p>

              <p className="mt-2 text-sm text-white/45">
                {item.label}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* ===================================================== */}
      {/* ABOUT */}
      {/* ===================================================== */}

      <section
        id="about"
        className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >
        <div className="grid gap-14 lg:grid-cols-[0.7fr_1.3fr]">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              About Duta Karya
            </p>
          </div>

          <div>
            <h2 className="max-w-4xl text-4xl font-semibold leading-tight tracking-[-0.04em] md:text-6xl">
              Built for structure.
              <br />
              Designed for space.
            </h2>

            <p className="mt-8 max-w-3xl text-lg leading-8 text-[#68645d]">
              Duta Karya Membrane berdiri sejak Agustus 2020 dan berbasis di
              Bandung. Kami mengerjakan pembuatan, desain, instalasi canopy,
              tensile structure, dan struktur baja dengan pendekatan custom
              sesuai kebutuhan proyek.
            </p>

            <div className="mt-12 grid gap-0 border-t border-black/10 md:grid-cols-2">
              {[
                [
                  "01",
                  "Established",
                  "Berdiri sejak Agustus 2020 di Bandung.",
                ],
                [
                  "02",
                  "Custom",
                  "Setiap proyek disesuaikan dengan kebutuhan.",
                ],
                [
                  "03",
                  "End-to-end",
                  "Dari desain, fabrikasi hingga instalasi.",
                ],
                [
                  "04",
                  "Detail",
                  "Fokus pada fungsi, struktur dan visual.",
                ],
              ].map(([number, title, description]) => (
                <div
                  key={number}
                  className="border-b border-black/10 py-7 md:pr-8"
                >
                  <span className="text-xs font-medium text-[#b89452]">
                    {number}.
                  </span>

                  <h3 className="mt-3 text-xl font-medium">
                    {title}
                  </h3>

                  <p className="mt-2 text-sm leading-6 text-[#77736c]">
                    {description}
                  </p>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* SERVICES */}
      {/* ===================================================== */}

      <section
        id="services"
        className="bg-[#ebe8e1] px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >
        <div className="mx-auto max-w-[1440px]">

          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                What We Do
              </p>

              <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Our services.
              </h2>
            </div>

            <p className="max-w-md text-sm leading-6 text-[#6d6962]">
              Kami membantu mewujudkan kebutuhan struktur dari tahap konsep
              hingga instalasi di lapangan.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] bg-black/10 md:grid-cols-2">
            {services.map((service) => (
              <article
                key={service.number}
                className="group bg-[#f7f5f0] p-8 transition-colors hover:bg-white md:p-10 lg:p-12"
              >
                <div className="flex items-start justify-between">

                  <span className="text-xs font-medium text-[#b89452]">
                    {service.number}
                  </span>

                  <span className="text-2xl text-[#aaa49a] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>

                </div>

                <h3 className="mt-20 text-3xl font-medium tracking-[-0.03em] md:text-4xl">
                  {service.title}
                </h3>

                <p className="mt-4 max-w-md text-sm leading-7 text-[#77736c]">
                  {service.description}
                </p>
              </article>
            ))}
          </div>

        </div>
      </section>


      {/* ===================================================== */}
      {/* MATERIALS */}
      {/* ===================================================== */}

      <section
        id="materials"
        className="bg-[#ebe8e1] px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >
        <div className="mx-auto max-w-[1440px]">
          <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                Material Guide
              </p>

              <h2 className="mt-5 max-w-3xl text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
                Canopy &amp;
                <br />
                <span className="text-[#8d8982]">membrane materials.</span>
              </h2>
            </div>

            <p className="max-w-md text-sm leading-7 text-[#6d6962]">
              Pilihan material untuk membantu menentukan solusi membrane dan
              canopy berdasarkan kebutuhan struktur, ketahanan, tampilan, dan
              penggunaan ruang.
            </p>
          </div>

          <div className="mt-14 grid gap-px overflow-hidden rounded-[1.5rem] bg-black/10 md:grid-cols-2">
            {materials.map((material) => (
              <article
                key={material.number}
                className="group bg-[#f7f5f0] p-7 transition-colors hover:bg-white md:p-9 lg:p-10"
              >
                <div className="flex items-start justify-between gap-6">
                  <span className="text-sm font-medium text-[#b89452]">
                    {material.number}
                  </span>

                  <span className="text-2xl text-[#aaa49a] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                    ↗
                  </span>
                </div>

                <h3 className="mt-10 text-2xl font-medium tracking-[-0.03em] md:text-3xl">
                  {material.title}
                </h3>

                <p className="mt-4 max-w-xl text-sm leading-7 text-[#77736c]">
                  {material.description}
                </p>

                <div className="mt-7 flex flex-wrap gap-2">
                  {material.features.map((feature) => (
                    <span
                      key={feature}
                      className="rounded-full border border-[#b89452]/25 bg-[#b89452]/5 px-3 py-1.5 text-xs text-[#6d6962]"
                    >
                      {feature}
                    </span>
                  ))}
                </div>

                <div className="mt-8 border-t border-black/10 pt-5">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-[#b89452]">
                    Aplikasi
                  </p>

                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2 text-xs text-[#77736c]">
                    {material.applications.map((application) => (
                      <span key={application}>{application}</span>
                    ))}
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-14 grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
            <div className="rounded-[1.5rem] bg-[#171717] p-7 text-white md:p-9 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                Material Comparison
              </p>

              <h3 className="mt-4 text-2xl font-medium md:text-3xl">
                Bandingkan karakter material.
              </h3>

              <div className="mt-8 overflow-x-auto">
                <table className="w-full min-w-[620px] border-collapse text-left text-xs">
                  <thead>
                    <tr className="border-b border-white/10 text-white/45">
                      <th className="px-3 py-3 font-medium">Material</th>
                      <th className="px-3 py-3 font-medium">UV</th>
                      <th className="px-3 py-3 font-medium">Waterproof</th>
                      <th className="px-3 py-3 font-medium">Flexible</th>
                      <th className="px-3 py-3 font-medium">Harga</th>
                    </tr>
                  </thead>

                  <tbody>
                    {materialComparison.map(
                      ([name, uv, waterproof, flexible, price]) => (
                        <tr
                          key={name}
                          className="border-b border-white/10 last:border-0"
                        >
                          <td className="px-3 py-3 font-medium text-white">
                            {name}
                          </td>
                          <td className="px-3 py-3 text-[#b89452]">{uv}</td>
                          <td className="px-3 py-3 text-[#b89452]">
                            {waterproof}
                          </td>
                          <td className="px-3 py-3 text-[#b89452]">
                            {flexible}
                          </td>
                          <td className="px-3 py-3 text-white/70">{price}</td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            <div className="rounded-[1.5rem] bg-white p-7 md:p-9 lg:p-10">
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                How to Choose
              </p>

              <h3 className="mt-4 text-2xl font-medium md:text-3xl">
                Pilih berdasarkan kebutuhan proyek.
              </h3>

              <div className="mt-8 space-y-0 border-t border-black/10">
                {[
                  ["01", "Area & fungsi", "Tentukan penggunaan dan karakter ruang."],
                  ["02", "Ketahanan", "Pertimbangkan UV, cuaca, air, dan umur pakai."],
                  ["03", "Visual", "Sesuaikan warna, transparansi, dan karakter material."],
                  ["04", "Budget", "Pilih spesifikasi yang seimbang dengan kebutuhan."],
                ].map(([number, title, description]) => (
                  <div
                    key={number}
                    className="grid grid-cols-[42px_1fr] gap-4 border-b border-black/10 py-5 last:border-b-0"
                  >
                    <span className="text-xs font-medium text-[#b89452]">
                      {number}
                    </span>

                    <div>
                      <h4 className="font-medium">{title}</h4>
                      <p className="mt-1 text-sm leading-6 text-[#77736c]">
                        {description}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>


      {/* ===================================================== */}
      {/* SELECTED PROJECTS */}
      {/* ===================================================== */}

      <section
        id="projects"
        className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >

        <div className="flex flex-col justify-between gap-8 md:flex-row md:items-end">

          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              Selected Projects
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              Duta Karya
              <br />
              <span className="text-[#8d8982]">
                highlights.
              </span>
            </h2>
          </div>

          <a
            href="/projects"
            className="!text-[#171717] text-sm font-medium underline underline-offset-8"
          >
            Explore all projects →
          </a>

        </div>

        {/* ===================================================== */}
        {/* DATABASE PROJECTS */}
        {/* ===================================================== */}

        {projects.length > 0 ? (

          <div className="mt-14 grid gap-6 md:grid-cols-2">

            {projects.map((project, index) => {

              // ==================================================
              // AMBIL FOTO PROJECT
              //
              // Prioritas:
              // 1. Foto yang ditandai sebagai COVER
              // 2. Foto pertama dari project
              // 3. Placeholder jika project belum memiliki foto
              // ==================================================

              const coverMedia =
                project.medias.find(
                  (projectMedia) => projectMedia.isCover
                )?.media ??
                project.medias[0]?.media ??
                null;

              return (
                <a
                  key={project.id}
                  href={`/projects/${project.slug}`}
                  className="group overflow-hidden rounded-[1.5rem] bg-[#1c1c1a] !text-white transition-transform duration-300 hover:-translate-y-1"
                >

                  {/* ==================================================
                      IMAGE
                  ================================================== */}

                  <div className="relative aspect-[4/3] overflow-hidden">

                    {coverMedia ? (

                      <img
                        src={coverMedia.url}
                        alt={
                          coverMedia.altText ||
                          project.title
                        }
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />

                    ) : (

                      <>
                        <div className="absolute inset-0 bg-[linear-gradient(135deg,#292722,#555044_45%,#191918)] transition-transform duration-700 group-hover:scale-105" />

                        <div className="absolute left-[12%] top-[35%] h-px w-[76%] rotate-[12deg] bg-[#c9ab72]/70" />

                        <div className="absolute left-[22%] top-[50%] h-px w-[62%] rotate-[-10deg] bg-white/20" />
                      </>

                    )}

                    <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.2em] text-white/60">
                      {project.category || "PROJECT"}
                    </div>

                  </div>

                  {/* ==================================================
                      CONTENT
                  ================================================== */}

                  <div className="p-7 md:p-8">

                    <div className="flex items-start justify-between gap-4">

                      <div className="min-w-0">

                        <p className="text-xs text-white/40">
                          Project {String(index + 1).padStart(2, "0")}
                        </p>

                        <h3 className="mt-2 text-2xl font-medium !text-white">
                          {project.title}
                        </h3>

                        {project.location && (
                          <p className="mt-2 text-sm text-white/55">
                            {project.location}
                          </p>
                        )}

                        {project.description && (
                          <p className="mt-4 line-clamp-2 max-w-lg text-sm leading-6 text-white/55">
                            {project.description}
                          </p>
                        )}

                      </div>

                      <span className="shrink-0 text-xl text-[#b89452] transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1">
                        ↗
                      </span>

                    </div>

                  </div>

                </a>
              );
            })}

          </div>

        ) : (

          <div className="mt-14 rounded-[1.5rem] border border-black/10 p-10 text-center">

            <p className="text-lg font-medium">
              Belum ada project.
            </p>

            <p className="mt-2 text-sm text-[#77736c]">
              Project yang sudah dipublish akan muncul di bagian ini.
            </p>

          </div>

        )}

      </section>

      {/* ===================================================== */}
      {/* PROCESS */}
      {/* ===================================================== */}

      <section
        id="process"
        className="bg-[#171717] px-6 py-24 text-white md:px-10 md:py-32 lg:px-14"
      >

        <div className="mx-auto max-w-[1440px]">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
            Our Process
          </p>

          <div className="mt-6 flex flex-col justify-between gap-8 md:flex-row md:items-end">

            <h2 className="text-4xl font-semibold tracking-[-0.04em] md:text-6xl">
              From idea
              <br />
              to installation.
            </h2>

            <p className="max-w-md text-sm leading-7 text-white/45">
              Proses kerja yang terstruktur membantu memastikan setiap proyek
              berjalan dari tahap awal hingga selesai dengan jelas.
            </p>

          </div>

          <div className="mt-16 grid border-t border-white/10 md:grid-cols-4">

            {process.map((item) => (
              <div
                key={item.number}
                className="border-b border-white/10 py-8 md:border-b-0 md:border-r md:px-7 md:first:pl-0 md:last:border-r-0"
              >

                <span className="text-xs text-[#b89452]">
                  {item.number}
                </span>

                <h3 className="mt-16 text-2xl font-medium">
                  {item.title}
                </h3>

                <p className="mt-4 text-sm leading-7 text-white/45">
                  {item.description}
                </p>

              </div>
            ))}

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* CONTACT */}
      {/* ===================================================== */}

      <section
        id="contact"
        className="mx-auto max-w-[1440px] px-6 py-24 md:px-10 md:py-32 lg:px-14"
      >

        <div className="rounded-[2rem] bg-[#b89452] px-7 py-14 md:px-14 md:py-20 lg:px-20">

          <div className="max-w-4xl">

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-black/50">
              Start a project
            </p>

            <h2 className="mt-5 text-4xl font-semibold leading-tight tracking-[-0.05em] md:text-6xl lg:text-7xl">
              Punya kebutuhan
              <br />
              struktur?
            </h2>

            <p className="mt-7 max-w-xl text-base leading-7 text-black/60 md:text-lg">
              Ceritakan kebutuhan proyek Anda. Kami siap membantu dari tahap
              konsultasi, desain, fabrikasi hingga instalasi.
            </p>

            {/* CTA BUTTON */}

            <Link
              href="/kontak"
              className="mt-9 inline-flex items-center justify-center rounded-full bg-[#171717] px-8 py-4 text-sm font-semibold !text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-white hover:!text-[#171717]"
            >
              Hubungi Kami
            </Link>

          </div>

        </div>
      </section>

      {/* ===================================================== */}
      {/* FOOTER */}
      {/* ===================================================== */}

      <footer className="border-t border-black/10 bg-[#f7f5f0]">

        <div className="mx-auto flex max-w-[1440px] flex-col gap-8 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">

          <div>

            <p className="font-semibold tracking-[-0.02em]">
              Duta Karya Membrane
            </p>

            <p className="mt-2 text-sm text-[#77736c]">
              Membrane · Tensile · Canopy · Steel
            </p>

          </div>

          <div className="text-sm text-[#77736c]">
            © {new Date().getFullYear()} Duta Karya Membrane
          </div>

        </div>

      </footer>

    </main>
  );
}