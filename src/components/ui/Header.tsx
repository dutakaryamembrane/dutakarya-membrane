"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => {
    setMobileMenuOpen(false);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-black/10 bg-[#f7f5f0]/90 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-4 sm:px-6 md:px-10 lg:px-14">

        {/* =====================================================
            LOGO
        ===================================================== */}
        <Link
          href="/"
          className="flex min-w-0 shrink-0 items-center gap-2 sm:gap-3"
          aria-label="Duta Karya Membrane"
          onClick={closeMobileMenu}
        >
          <Image
            src="/images/logo-dkm.png"
            alt="Duta Karya Membrane"
            width={72}
            height={72}
            className="h-14 w-14 shrink-0 object-contain sm:h-16 sm:w-16"
            priority
          />

          <span className="whitespace-nowrap text-[11px] font-semibold uppercase tracking-[0.10em] text-[#171717] sm:text-[15px] sm:tracking-[0.12em]">
            Duta Karya Membrane
          </span>
        </Link>

        {/* =====================================================
            DESKTOP NAVIGATION
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
            DESKTOP RIGHT SIDE BUTTONS
        ===================================================== */}
        <div className="hidden items-center gap-3 md:flex">

          {/* =================================================
              ADMIN LOGIN
          ================================================= */}
          <Link
            href="/login"
            className="
              inline-flex
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

        {/* =====================================================
            MOBILE MENU BUTTON
        ===================================================== */}
        <button
          type="button"
          aria-label={mobileMenuOpen ? "Tutup menu" : "Buka menu"}
          aria-expanded={mobileMenuOpen}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="
            inline-flex
            h-11
            w-11
            shrink-0
            items-center
            justify-center
            rounded-full
            bg-[#171717]
            !text-white
            md:hidden
          "
        >
          {mobileMenuOpen ? (
            <span className="text-2xl leading-none">
              ×
            </span>
          ) : (
            <span className="flex flex-col gap-1.5">
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
              <span className="block h-0.5 w-5 bg-white" />
            </span>
          )}
        </button>

      </div>

      {/* =====================================================
          MOBILE MENU
      ===================================================== */}
      {mobileMenuOpen && (
        <div className="border-t border-black/10 bg-[#f7f5f0] md:hidden">
          <nav className="mx-auto flex max-w-[1440px] flex-col px-6 py-5">

            <Link
              href="/#about"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Tentang
            </Link>

            <Link
              href="/#services"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Layanan
            </Link>

            <Link
              href="/#projects"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Proyek
            </Link>

            <Link
              href="/#materials"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Material
            </Link>

            <Link
              href="/#process"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Proses
            </Link>

            <Link
              href="/#contact"
              onClick={closeMobileMenu}
              className="border-b border-black/10 py-4 text-base font-medium !text-[#171717]"
            >
              Kontak
            </Link>

            {/* =================================================
                MOBILE ACTION BUTTONS
            ================================================= */}
            <div className="flex flex-col gap-3 pt-5">

              <Link
                href="/login"
                onClick={closeMobileMenu}
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/15
                  px-5
                  py-3
                  text-sm
                  font-medium
                  !text-[#171717]
                  transition-all
                  duration-300
                  hover:bg-[#171717]
                  hover:!text-white
                "
              >
                Admin
              </Link>

              <Link
                href="/#contact"
                onClick={closeMobileMenu}
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
                  hover:bg-[#2a2a2a]
                "
              >
                Konsultasi
              </Link>

            </div>

          </nav>
        </div>
      )}

    </header>
  );
}