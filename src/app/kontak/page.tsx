"use client";

import { FormEvent, useState } from "react";

export default function KontakPage() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    service: "",
    message: "",
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  // ==========================================
  // WHATSAPP
  // ==========================================

  const whatsappMessage =
    "Halo Duta Karya Membrane, saya ingin melakukan konsultasi mengenai kebutuhan proyek saya.";

  const whatsappNumber1 = "6285183381715";
  const whatsappNumber2 = "6289658026869";

  const whatsappUrl1 = `https://wa.me/${whatsappNumber1}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  const whatsappUrl2 = `https://wa.me/${whatsappNumber2}?text=${encodeURIComponent(
    whatsappMessage
  )}`;

  // ==========================================
  // HANDLE INPUT
  // ==========================================

  function handleChange(
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  }

  // ==========================================
  // SUBMIT CONSULTATION
  // ==========================================

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);
    setSuccess("");
    setError("");

    try {
      const response = await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(
          result.message || "Konsultasi gagal dikirim."
        );
      }

      setSuccess(
        "Terima kasih. Konsultasi Anda berhasil dikirim. Tim Duta Karya Membrane akan segera menghubungi Anda."
      );

      setForm({
        name: "",
        email: "",
        phone: "",
        company: "",
        service: "",
        message: "",
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Terjadi kesalahan saat mengirim konsultasi."
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-[#f7f5f0] text-[#171717]">

      {/* ==========================================
          HEADER
      ========================================== */}

      <header className="border-b border-black/10 bg-[#f7f5f0]">
        <div className="mx-auto flex h-20 max-w-[1440px] items-center justify-between px-6 md:px-10 lg:px-14">

          <a
            href="/"
            className="text-lg font-semibold tracking-[-0.03em]"
          >
            Duta Karya Membrane
          </a>

          <a
            href="/"
            className="rounded-full bg-[#171717] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[#b89452] hover:text-white"
            style={{ color: "#ffffff" }}
          >
            Kembali
          </a>

        </div>
      </header>

      {/* ==========================================
          HERO
      ========================================== */}

      <section className="bg-[#171717] px-6 py-20 text-white md:px-10 lg:px-14">
        <div className="mx-auto max-w-[1440px]">

          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
            Consultation
          </p>

          <h1 className="mt-5 max-w-4xl text-5xl font-semibold leading-tight tracking-[-0.05em] md:text-7xl">
            Mari mulai
            <br />
            proyek Anda.
          </h1>

          <p className="mt-7 max-w-2xl text-base leading-7 text-white/60 md:text-lg">
            Ceritakan kebutuhan proyek Anda kepada kami.
            Tim Duta Karya Membrane siap membantu dari tahap
            konsultasi, desain, fabrikasi hingga instalasi.
          </p>

        </div>
      </section>

      {/* ==========================================
          CONTACT / FORM SECTION
      ========================================== */}

      <section className="mx-auto max-w-[1440px] px-6 py-16 md:px-10 md:py-24 lg:px-14">

        <div className="grid gap-12 lg:grid-cols-[0.7fr_1.3fr]">

          {/* ==========================================
              LEFT INFO
          ========================================== */}

          <div>

            <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
              Start a project
            </p>

            <h2 className="mt-5 text-4xl font-semibold tracking-[-0.04em] md:text-5xl">
              Punya kebutuhan struktur?
            </h2>

            <p className="mt-6 max-w-md text-base leading-7 text-[#68645d]">
              Isi formulir di samping dengan informasi dasar
              proyek Anda. Semakin lengkap informasinya,
              semakin mudah bagi tim kami memahami kebutuhan Anda.
            </p>

            {/* ==========================================
                COMPANY INFO
            ========================================== */}

            <div className="mt-10 border-t border-black/10 pt-8">

              <p className="text-sm font-semibold">
                Duta Karya Membrane
              </p>

              <p className="mt-2 text-sm text-[#77736c]">
                Membrane · Tensile · Canopy · Steel
              </p>

              <a
                href="mailto:dutakaryamembrane@gmail.com"
                className="mt-5 inline-block text-sm font-medium underline underline-offset-4"
              >
                dutakaryamembrane@gmail.com
              </a>

            </div>

            {/* ==========================================
                WHATSAPP CONSULTATION
            ========================================== */}

            <div className="mt-10 rounded-[2rem] border border-black/10 bg-white p-7 shadow-sm md:p-8">

              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#b89452]">
                Konsultasi Langsung
              </p>

              <h3 className="mt-4 text-2xl font-semibold tracking-[-0.03em] text-[#171717]">
                Lebih cepat lewat WhatsApp
              </h3>

              <p className="mt-4 text-sm leading-6 text-[#68645d]">
                Jika Anda ingin langsung berbicara dengan tim kami,
                Anda dapat memilih salah satu nomor WhatsApp berikut.
              </p>

              {/* ==========================================
                  WHATSAPP 1
                  NOMOR TIDAK DITAMPILKAN
              ========================================== */}

              <a
                href={whatsappUrl1}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-6
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  bg-[#171717]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-white
                  transition-all
                  duration-200
                  ease-out
                  hover:bg-[#b89452]
                  hover:!text-white
                "
                style={{ color: "#ffffff" }}
              >
                Rara
              </a>

              {/* ==========================================
                  WHATSAPP 2
                  NOMOR TIDAK DITAMPILKAN
              ========================================== */}

              <a
                href={whatsappUrl2}
                target="_blank"
                rel="noopener noreferrer"
                className="
                  mt-3
                  flex
                  w-full
                  items-center
                  justify-center
                  rounded-full
                  border
                  border-black/10
                  bg-[#f7f5f0]
                  px-6
                  py-3.5
                  text-sm
                  font-semibold
                  !text-[#171717]
                  transition-all
                  duration-200
                  ease-out
                  hover:border-[#b89452]
                  hover:bg-[#b89452]
                  hover:!text-white
                "
              >
                Moch Apandi Ridwan
              </a>

            </div>

          </div>

          {/* ==========================================
              CONSULTATION FORM
          ========================================== */}

          <form
            onSubmit={handleSubmit}
            className="rounded-[2rem] bg-white p-7 shadow-sm md:p-10"
          >

            <div className="grid gap-6 md:grid-cols-2">

              {/* NAME */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Nama *
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  required
                  placeholder="Nama lengkap"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                />

              </div>

              {/* EMAIL */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Email *
                </label>

                <input
                  type="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  required
                  placeholder="nama@email.com"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                />

              </div>

              {/* PHONE */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Nomor WhatsApp / Telepon *
                </label>

                <input
                  type="tel"
                  name="phone"
                  value={form.phone}
                  onChange={handleChange}
                  required
                  placeholder="08xxxxxxxxxx"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                />

              </div>

              {/* COMPANY */}

              <div>

                <label className="mb-2 block text-sm font-medium">
                  Perusahaan
                </label>

                <input
                  type="text"
                  name="company"
                  value={form.company}
                  onChange={handleChange}
                  placeholder="Nama perusahaan"
                  className="w-full rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                />

              </div>

              {/* SERVICE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Kebutuhan Layanan *
                </label>

                <select
                  name="service"
                  value={form.service}
                  onChange={handleChange}
                  required
                  className="w-full rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                >

                  <option value="">
                    Pilih layanan
                  </option>

                  <option value="Membrane">
                    Membrane
                  </option>

                  <option value="Tensile Structure">
                    Tensile Structure
                  </option>

                  <option value="Canopy">
                    Canopy
                  </option>

                  <option value="Steel Structure">
                    Steel Structure
                  </option>

                  <option value="Konsultasi">
                    Konsultasi / Lainnya
                  </option>

                </select>

              </div>

              {/* MESSAGE */}

              <div className="md:col-span-2">

                <label className="mb-2 block text-sm font-medium">
                  Detail Kebutuhan *
                </label>

                <textarea
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  required
                  rows={7}
                  placeholder="Ceritakan kebutuhan proyek, lokasi, ukuran area, jenis struktur, atau informasi lain yang sudah Anda miliki."
                  className="w-full resize-none rounded-xl border border-black/10 bg-[#f7f5f0] px-4 py-3.5 text-sm outline-none transition focus:border-[#b89452]"
                />

              </div>

            </div>

            {/* ==========================================
                ERROR MESSAGE
            ========================================== */}

            {error && (
              <div className="mt-6 rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700">
                {error}
              </div>
            )}

            {/* ==========================================
                SUCCESS MESSAGE
            ========================================== */}

            {success && (
              <div className="mt-6 rounded-xl bg-green-50 px-4 py-3 text-sm leading-6 text-green-700">
                {success}
              </div>
            )}

            {/* ==========================================
                SUBMIT BUTTON
            ========================================== */}

            <button
              type="submit"
              disabled={loading}
              className="mt-8 inline-flex w-full items-center justify-center rounded-full bg-[#171717] px-8 py-4 text-sm font-semibold text-white transition hover:-translate-y-0.5 hover:bg-[#b89452] disabled:cursor-not-allowed disabled:opacity-50"
            >
              {loading
                ? "Mengirim..."
                : "Kirim Konsultasi"}
            </button>

            <p className="mt-4 text-center text-xs leading-5 text-[#77736c]">
              Data yang Anda kirim akan digunakan untuk
              kebutuhan komunikasi proyek.
            </p>

          </form>

        </div>

      </section>

      {/* ==========================================
          FOOTER
      ========================================== */}

      <footer className="border-t border-black/10 bg-[#f7f5f0]">

        <div className="mx-auto flex max-w-[1440px] flex-col gap-4 px-6 py-10 md:flex-row md:items-center md:justify-between md:px-10 lg:px-14">

          <div>

            <p className="font-semibold">
              Duta Karya Membrane
            </p>

            <p className="mt-2 text-sm text-[#77736c]">
              Membrane · Tensile · Canopy · Steel
            </p>

          </div>

          <p className="text-sm text-[#77736c]">
            © {new Date().getFullYear()} Duta Karya Membrane
          </p>

        </div>

      </footer>

    </main>
  );
}