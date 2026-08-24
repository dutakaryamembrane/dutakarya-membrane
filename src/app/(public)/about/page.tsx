import React from "react";
import { Header } from "@/components/ui/Header";
import { Footer } from "@/components/ui/Footer";

export default function AboutPage() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Page Title Header */}
      <section className="bg-charcoal text-white py-16 md:py-24">
        <div className="max-width-1440 mx-auto px-6">
          <span className="text-gold font-bold text-xs uppercase tracking-wider block mb-2">PROFIL PERUSAHAAN</span>
          <h1 className="text-3xl md:text-5xl font-extrabold tracking-tight text-white">Tentang Duta Karya Membrane</h1>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-warmWhite">
        <div className="max-width-1440 mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-12">
          <div className="lg:col-span-6 flex flex-col gap-6">
            <h2 className="text-2xl font-bold text-charcoal">Visi & Misi Kami</h2>
            <p className="text-xs text-mutedText leading-relaxed">
              Duta Karya Membrane berkomitmen untuk menjadi perusahaan konstruksi tensile membrane terdepan di Indonesia, menghadirkan produk berkualitas tinggi dengan desain arsitektural yang elegan dan fungsional.
            </p>
            <div className="border-l-4 border-gold pl-6 py-2 my-4">
              <p className="text-sm font-bold text-charcoal italic">"Structures that shape your space."</p>
            </div>
          </div>
          <div className="lg:col-span-6 bg-white p-8 rounded-card card-shadow border border-gray-100 flex flex-col gap-6">
            <h3 className="text-lg font-bold text-charcoal">Mengapa Memilih Kami?</h3>
            <ul className="flex flex-col gap-4 text-xs text-mutedText">
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold">➔</span>
                <div>
                  <strong>Bahan Berkualitas:</strong> Menggunakan kain membrane bersertifikat standar internasional (Serge Ferrari, Heytex, Agtex).
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold">➔</span>
                <div>
                  <strong>Presisi Konstruksi:</strong> Proses fabrikasi rangka baja dilakukan oleh welder bersertifikat dengan perhitungan teknik sipil.
                </div>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-gold font-bold">➔</span>
                <div>
                  <strong>Garansi Terjamin:</strong> Memberikan jaminan kualitas pekerjaan dan ketahanan bahan hingga 10 tahun.
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
