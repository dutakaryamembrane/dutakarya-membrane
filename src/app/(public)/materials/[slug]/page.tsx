import React from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Server Query mock (in standard architecture, this fetches from PostgreSQL database)
const getMaterialBySlug = async (slug: string) => {
  const materials = [
    {
      name: "Membrane Fabric Serge Ferrari",
      slug: "membrane-fabric-serge-ferrari",
      category: "Membrane",
      shortDescription: "PVC / PVDF premium membrane fabric made in France.",
      description: "Serge Ferrari Precontraint membrane merupakan standar industri tertinggi untuk tensile structure. Memiliki ketahanan cuaca luar biasa, mudah dibersihkan berkat teknologi PVDF coating, serta proteksi UV optimal.",
      manufacturer: "Serge Ferrari France",
      productCode: "Ferrari 702 / 902 / 1002",
      advantages: "Flame retardant, UV Resistant, Self-cleaning surface, Extreme tensile strength.",
      specifications: {
        "Material Type": "Precontraint PVC with PVDF Top Coat",
        "Base Fabric": "High-tenacity polyester micro-cables",
        "Total Weight": "900 g/m²",
        "Tensile Strength": "400 / 380 daN/5cm",
        "Tear Strength": "50 / 45 daN",
        "Fire Rating": "Class B-s2, d0 (EN 13501-1)",
        "Warranty": "10 Years Limited Warranty"
      }
    },
    {
      name: "Galvanized Steel Pipe Structure",
      slug: "galvanized-steel-pipe-structure",
      category: "Steel Structure",
      shortDescription: "Carbon steel pipes with hot-dip galvanized finish.",
      description: "Pipa besi seamless galvanis yang didesain dan difabrikasi khusus dengan sistem bending presisi untuk menyangga beban tegangan tensile membrane yang sangat tinggi.",
      manufacturer: "SPSI / Krakatau Steel",
      productCode: "Sch40 Carbon Steel Pipe",
      advantages: "Korosi resistan tinggi, sambungan pengelasan presisi standar sipil, awet hingga puluhan tahun.",
      specifications: {
        "Material Type": "Medium Carbon Steel Schedule 40",
        "Anti-Rust Coating": "Hot-dip galvanizing (min 450 g/m²)",
        "Bending Radius": "Custom computer-controlled precision bending",
        "Tensile Yield": "250 MPa",
        "Standard": "ASTM A53 / API 5L"
      }
    }
  ];
  return materials.find((m) => m.slug === slug);
};

export default async function MaterialDetailPage({ params }: { params: { slug: string } }) {
  const material = await getMaterialBySlug(params.slug);

  if (!material) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <div className="flex-1 flex flex-col items-center justify-center p-12 bg-warmWhite">
          <h1 className="text-2xl font-bold mb-4">Material Tidak Ditemukan</h1>
          <Link href="/materials">
            <Button variant="primary">Kembali ke Daftar Material</Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <section className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <span className="text-gold font-bold text-xs uppercase tracking-wider block mb-2">{material.category} SPECIFICATION</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">{material.name}</h1>
        </div>
      </section>

      <section className="py-20 bg-warmWhite">
        <div className="max-width-1440 mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Main Content details */}
          <div className="lg:col-span-7 flex flex-col gap-8">
            <div className="bg-white p-8 rounded-card card-shadow border border-gray-100">
              <h2 className="text-xl font-bold text-charcoal mb-4">Deskripsi Material</h2>
              <p className="text-xs text-mutedText leading-relaxed mb-6">{material.description}</p>
              
              <h3 className="text-sm font-bold text-charcoal mb-2">Keunggulan Utama</h3>
              <p className="text-xs text-mutedText leading-relaxed bg-gray-50 p-4 rounded-lg border-l-4 border-gold">
                {material.advantages}
              </p>
            </div>

            <div className="bg-white p-8 rounded-card card-shadow border border-gray-100 grid grid-cols-2 gap-6 text-xs text-mutedText">
              <div>
                <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1">Manufacturer / Brand</p>
                <p className="text-charcoal font-semibold text-sm">{material.manufacturer || "-"}</p>
              </div>
              <div>
                <p className="text-[10px] font-bold text-gold uppercase tracking-wider mb-1">Product Code</p>
                <p className="text-charcoal font-semibold text-sm">{material.productCode || "-"}</p>
              </div>
            </div>
          </div>

          {/* Technical Specs box */}
          <div className="lg:col-span-5">
            <div className="bg-white p-8 rounded-card card-shadow border border-gray-100">
              <h3 className="text-lg font-bold text-charcoal mb-6 border-b border-gray-100 pb-3">Technical Parameters</h3>
              <div className="flex flex-col gap-4">
                {Object.entries(material.specifications || {}).map(([key, val]) => (
                  <div key={key} className="flex justify-between items-center text-xs border-b border-gray-50 pb-2.5">
                    <span className="text-gray-400 font-medium">{key}</span>
                    <span className="text-charcoal font-bold text-right">{String(val)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
