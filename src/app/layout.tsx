import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: {
    default: "Duta Karya Membrane",
    template: "%s | Duta Karya Membrane",
  },
  description:
    "Solusi pembuatan dan pemasangan membrane, tensile structure, canopy, dan struktur baja untuk hunian, bisnis, dan ruang publik.",
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