import Link from "next/link";
import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import StatusConsultation from "@/components/admin/StatusConsultation";

export const dynamic = "force-dynamic";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

function getStatusStyle(status: string) {
  switch (status) {
    case "PROCESSING":
      return {
        background: "#e8f0f8",
        color: "#315d86",
      };

    case "COMPLETED":
      return {
        background: "#e5f4ea",
        color: "#287044",
      };

    case "NEW":
    default:
      return {
        background: "#f7e9c9",
        color: "#9a6c21",
      };
  }
}

export default async function ConsultationDetailPage({
  params,
}: PageProps) {
  const { id } = await params;

  const consultation =
    await prisma.consultation.findUnique({
      where: {
        id,
      },
    });

  if (!consultation) {
    notFound();
  }

  const formattedDate = new Intl.DateTimeFormat(
    "id-ID",
    {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    }
  ).format(new Date(consultation.createdAt));

  const whatsappNumber =
    consultation.phone?.replace(/\D/g, "") ?? "";

  const whatsappUrl =
    `https://wa.me/${whatsappNumber}`;

  const statusStyle = getStatusStyle(
    consultation.status
  );

  return (
    <main className="min-h-screen bg-[#f7f5f0] px-6 py-10">
      <div className="mx-auto max-w-[1400px]">

        {/* =====================================================
            BACK
        ===================================================== */}

        <Link
          href="/admin/consultations"
          className="inline-flex items-center text-sm font-medium text-[#003b70] transition hover:opacity-70"
        >
          ← Kembali ke Konsultasi
        </Link>

        {/* =====================================================
            HEADER
        ===================================================== */}

        <div className="mt-8 flex items-start justify-between gap-6">
          <div>
            <p className="text-[11px] font-medium uppercase tracking-[0.35em] text-[#b9893f]">
              Detail Konsultasi
            </p>

            <h1 className="mt-2 text-3xl font-semibold tracking-tight text-[#080808] md:text-4xl">
              {consultation.name}
            </h1>

            <p className="mt-2 text-sm text-[#536987]">
              Permintaan konsultasi dari website
              Duta Karya Membrane.
            </p>
          </div>

          {/* STATUS BADGE */}

          <span
            className="rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-wide"
            style={{
              backgroundColor:
                statusStyle.background,
              color: statusStyle.color,
            }}
          >
            {consultation.status}
          </span>
        </div>

        {/* =====================================================
            MAIN CARD
        ===================================================== */}

        <section className="mt-8 overflow-hidden rounded-[24px] border border-[#dedbd5] bg-white shadow-sm">

          {/* ===================================================
              CONTACT INFORMATION
          =================================================== */}

          <div className="p-8 md:p-10">
            <h2 className="text-lg font-semibold text-[#080808]">
              Informasi Kontak
            </h2>

            <div className="mt-7 grid grid-cols-1 gap-x-16 gap-y-7 md:grid-cols-2">

              {/* EMAIL */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  Email
                </p>

                <a
                  href={`mailto:${consultation.email}`}
                  className="mt-2 block text-sm text-[#003b70] hover:underline"
                >
                  {consultation.email}
                </a>
              </div>

              {/* PHONE / WHATSAPP */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  WhatsApp / Telepon
                </p>

                <div className="mt-2 flex items-center gap-3">
                  <a
                    href={`tel:${consultation.phone}`}
                    className="text-sm text-[#003b70] hover:underline"
                  >
                    {consultation.phone}
                  </a>

                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Hubungi melalui WhatsApp"
                    className="inline-flex h-9 min-w-[100px] items-center justify-center rounded-full bg-[#171717] px-5 text-xs font-semibold"
                    style={{
                      color: "#ffffff",
                      backgroundColor: "#171717",
                    }}
                  >
                    WhatsApp
                  </a>
                </div>
              </div>

              {/* COMPANY */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  Perusahaan
                </p>

                <p className="mt-2 text-sm text-[#17395c]">
                  {consultation.company || "-"}
                </p>
              </div>

              {/* SERVICE */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  Layanan
                </p>

                <p className="mt-2 text-sm text-[#17395c]">
                  {consultation.service}
                </p>
              </div>

              {/* DATE */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  Tanggal Masuk
                </p>

                <p className="mt-2 text-sm text-[#17395c]">
                  {formattedDate}
                </p>
              </div>

              {/* ID */}

              <div>
                <p className="text-[11px] font-medium uppercase tracking-wide text-[#8290a5]">
                  ID Konsultasi
                </p>

                <p className="mt-2 break-all font-mono text-xs text-[#536987]">
                  {consultation.id}
                </p>
              </div>
            </div>
          </div>

          {/* ===================================================
              MESSAGE
          =================================================== */}

          <div className="border-t border-[#e7e4de] p-8 md:p-10">
            <h2 className="text-lg font-semibold text-[#080808]">
              Detail Kebutuhan
            </h2>

            <div className="mt-5 rounded-2xl bg-[#faf9f6] p-5">
              <p className="whitespace-pre-wrap text-sm leading-7 text-[#17395c]">
                {consultation.message}
              </p>
            </div>
          </div>

          {/* ===================================================
              STATUS MANAGEMENT
          =================================================== */}

          <div className="border-t border-[#e7e4de] p-8 md:p-10">
            <StatusConsultation
              consultationId={consultation.id}
              initialStatus={consultation.status}
            />
          </div>

          {/* ===================================================
              ACTIONS
          =================================================== */}

          <div className="border-t border-[#e7e4de] p-8 md:p-10">
            <div className="flex flex-wrap items-center gap-3">

              {/* WHATSAPP */}

              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-full border border-[#171717] bg-white px-6 py-3 text-sm font-semibold"
                style={{
                  color: "#171717",
                  backgroundColor: "#ffffff",
                }}
              >
                Hubungi via WhatsApp
              </a>

              {/* BACK */}

              <Link
                href="/admin/consultations"
                className="inline-flex items-center justify-center rounded-full border border-[#d9dfe7] bg-white px-6 py-3 text-sm font-medium"
                style={{
                  color: "#17395c",
                  backgroundColor: "#ffffff",
                }}
              >
                Kembali
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}