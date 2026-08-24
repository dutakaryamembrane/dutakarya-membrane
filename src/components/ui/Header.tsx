"use client";

import Image from "next/image";
import Link from "next/link";

export function Header() {
  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-14">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="flex items-center gap-3 shrink-0"
          aria-label="Duta Karya Membrane"
        >
          <Image
            src="/images/logo-dkm.png"
            alt="Duta Karya Membrane"
            width={72}
            height={72}
            className="h-16 w-16 object-contain"
            priority
          />

          <span className="whitespace-nowrap text-[15px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
            Duta Karya Membrane
          </span>
        </Link>

        {/* =====================================================
            NAVIGATION
        ===================================================== */}
        <nav className="hidden items-center gap-8 text-sm md:flex">

          <Link
            href="/#about"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >
            Tentang
          </Link>

          <Link
            href="/#services"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >
            Layanan
          </Link>

          <Link
            href="/#projects"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >           
            Proyek
          </Link>
          
          <Link
            href="/#materials"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >
            Material
          </Link>

          <Link
            href="/#process"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >
            Proses
          </Link>

          <Link
            href="/#contact"
            className="!text-[#171717] transition-opacity hover:opacity-50"
          >
            Kontak
          </Link>

        </nav>

        {/* =====================================================
            RIGHT SIDE BUTTONS
        ===================================================== */}
        <div className="flex items-center gap-3">

          {/* =================================================
              ADMIN LOGIN
          ================================================= */}
          <Link
            href="/login"
            className="
              hidden
              rounded-full
              border
              border-black/15
              px-5
              py-2.5
              text-sm
              font-medium
              !text-[#171717]
              transition-all
              duration-300
              hover:bg-[#171717]
              hover:!text-white
              md:inline-flex
            "
          >
            Admin
          </Link>

          {/* =================================================
              CONSULTATION
          ================================================= */}
          <Link
            href="/#contact"
            className="
              inline-flex
              items-center
              justify-center
              rounded-full
              bg-[#171717]
              px-6
              py-3
              text-sm
              font-semibold
              !text-white
              transition-all
              duration-300
              hover:-translate-y-0.5
              hover:bg-[#2a2a2a]
            "
          >
            Konsultasi
          </Link>

        </div>
      </div>
    </header>
  );
}