import type { Metadata } from "next";
import "./globals.css";

const siteUrl = "https://dutakarya-membrane.vercel.app";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),

  title: {
    default:
      "Duta Karya Membrane | Membrane, Tensile, Canopy & Steel Structure",
    template: "%s | Duta Karya Membrane",
  },

  description:
    "Duta Karya Membrane menyediakan solusi pembuatan dan pemasangan membrane, tensile structure, canopy, dan struktur baja untuk hunian, bisnis, dan ruang publik.",

  keywords: [
    "Duta Karya Membrane",
    "membrane",
    "tensile membrane",
    "tensile structure",
    "canopy membrane",
    "canopy",
    "struktur baja",
    "membrane Indonesia",
    "tensile structure Indonesia",
    "jasa canopy",
    "jasa membrane",
  ],

  authors: [
    {
      name: "Duta Karya Membrane",
    },
  ],

  creator: "Duta Karya Membrane",
  publisher: "Duta Karya Membrane",

  alternates: {
    canonical: "/",
  },

  /*
   * Google Search Console Verification
   */
  verification: {
    google: "faAvheQ3jEumV6s__XptD3IjMiMeB_FsZxWYTHBztOs",
  },

  openGraph: {
    type: "website",
    locale: "id_ID",
    url: siteUrl,
    siteName: "Duta Karya Membrane",
    title:
      "Duta Karya Membrane | Membrane, Tensile, Canopy & Steel Structure",
    description:
      "Solusi pembuatan dan pemasangan membrane, tensile structure, canopy, dan struktur baja untuk hunian, bisnis, dan ruang publik.",
    images: [
      {
        url: "/images/logo-dkm.png",
        width: 800,
        height: 800,
        alt: "Duta Karya Membrane",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title:
      "Duta Karya Membrane | Membrane, Tensile, Canopy & Steel Structure",
    description:
      "Solusi membrane, tensile structure, canopy, dan struktur baja untuk berbagai kebutuhan proyek.",
    images: ["/images/logo-dkm.png"],
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}