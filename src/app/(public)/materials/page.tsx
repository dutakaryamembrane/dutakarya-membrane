import React from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

// Server Query mock (in standard architecture, this fetches from PostgreSQL database)
const getMaterials = async () => {
  return [
    {
      name: "Membrane Fabric Serge Ferrari",
      slug: "membrane-fabric-serge-ferrari",
      category: "Membrane",
      shortDescription: "PVC / PVDF premium membrane fabric made in France.",
      manufacturer: "Serge Ferrari France",
      productCode: "Ferrari 702 / 902 / 1002"
    },
    {
      name: "Galvanized Steel Pipe Structure",
      slug: "galvanized-steel-pipe-structure",
      category: "Steel Structure",
      shortDescription: "Carbon steel pipes with hot-dip galvanized finish.",
      manufacturer: "SPSI / Krakatau Steel",
      productCode: "Sch40 Carbon Steel Pipe"
    }
  ];
};

export default async function MaterialsPage() {
  const materials = await getMaterials();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <section className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <span className="text-gold font-bold text-xs uppercase tracking-wider block mb-2">MATERIAL GUIDE</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Product & Material Specifications</h1>
        </div>
      </section>

      <section className="py-20 bg-warmWhite">
        <div className="max-width-1440 mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {materials.map((mat) => (
              <div key={mat.slug} className="bg-white p-8 rounded-card card-shadow border border-gray-100 flex flex-col justify-between hover:border-gold transition-all">
                <div>
                  <span className="text-[10px] font-bold text-gold uppercase tracking-wider block mb-2">{mat.category}</span>
                  <h3 className="text-xl font-bold text-charcoal mb-3">{mat.name}</h3>
                  <p className="text-xs text-mutedText leading-relaxed mb-6">{mat.shortDescription}</p>
                  
                  <div className="grid grid-cols-2 gap-4 text-xs border-t border-gray-100 pt-4 mb-6">
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Brand / Produsen</p>
                      <p className="text-charcoal font-medium">{mat.manufacturer}</p>
                    </div>
                    <div>
                      <p className="text-gray-400 font-semibold uppercase tracking-wider text-[10px]">Kode Produk</p>
                      <p className="text-charcoal font-medium">{mat.productCode}</p>
                    </div>
                  </div>
                </div>

                <Link href={`/materials/${mat.slug}`}>
                  <Button variant="outline" className="w-full">Lihat Detail Spesifikasi ➔</Button>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
