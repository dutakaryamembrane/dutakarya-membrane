import React from "react";
import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-charcoal text-white pt-16 pb-8 border-t border-gray-800">
      <div className="max-width-1440 mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Company Identity */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-full border-2 border-gold flex items-center justify-center p-1 bg-white">
              <svg viewBox="0 0 100 100" className="w-full h-full text-charcoal">
                <path d="M15,55 Q50,20 85,55 Q50,45 15,55 Z" fill="currentColor" />
                <path d="M20,62 Q50,40 80,62" stroke="#c9a961" strokeWidth="6" fill="none" />
              </svg>
            </div>
            <div className="flex flex-col">
              <span className="font-extrabold text-sm tracking-widest text-white">DUTA KARYA</span>
              <span className="text-[10px] tracking-[0.25em] text-gold font-bold">MEMBRANE</span>
            </div>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed mt-2">
            Solusi pembuatan dan pemasangan membrane, tensile structure, canopy, dan struktur baja berkualitas premium serta berorientasi pada nilai estetika arsitektur tinggi.
          </p>
        </div>

        {/* Navigation links */}
        <div>
          <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Navigasi</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            <li><Link href="/about" className="hover:text-white transition-colors">Tentang Kami</Link></li>
            <li><Link href="/services" className="hover:text-white transition-colors">Produk & Jasa</Link></li>
            <li><Link href="/projects" className="hover:text-white transition-colors">Proyek & Portfolio</Link></li>
            <li><Link href="/materials" className="hover:text-white transition-colors">Material</Link></li>
          </ul>
        </div>

        {/* Materials Categories */}
        <div>
          <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Layanan Utama</h4>
          <ul className="flex flex-col gap-2.5 text-xs text-gray-400">
            <li><span className="hover:text-white transition-colors">Membrane Structure</span></li>
            <li><span className="hover:text-white transition-colors">Tensile Structure</span></li>
            <li><span className="hover:text-white transition-colors">Canopy & Carport</span></li>
            <li><span className="hover:text-white transition-colors">Steel Structure Fabrication</span></li>
          </ul>
        </div>

        {/* Contact info */}
        <div>
          <h4 className="text-sm font-bold text-gold uppercase tracking-wider mb-4">Kontak Kami</h4>
          <p className="text-xs text-gray-400 leading-relaxed">
            <strong>Email:</strong> dutakaryamembrane@gmail.com<br />
            <strong>Lokasi:</strong> Bandung, Indonesia<br />
            <strong>WhatsApp:</strong> +62 812-3456-7890
          </p>
          <div className="mt-4 flex gap-4">
            <a href="https://wa.me/6281234567890" target="_blank" rel="noopener noreferrer" className="bg-gold hover:bg-opacity-90 text-white px-4 py-2 rounded-pill font-bold text-xs transition-all">
              Chat via WhatsApp
            </a>
          </div>
        </div>
      </div>

      <div className="max-width-1440 mx-auto px-6 border-t border-gray-800 pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-gray-500">
        <p>&copy; {new Date().getFullYear()} Duta Karya Membrane. All rights reserved.</p>
        <div className="flex gap-4 mt-4 sm:mt-0">
          <Link href="/login" className="hover:text-white">Admin Portal</Link>
          <span className="text-gray-700">|</span>
          <span className="text-gray-500">Built for structure. Designed for space.</span>
        </div>
      </div>
    </footer>
  );
}
