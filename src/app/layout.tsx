import type { Metadata, Viewport } from "next";
import { Inter, Instrument_Serif, JetBrains_Mono } from "next/font/google";
import "./globals.css";
import { ServiceWorker } from "@/components/ServiceWorker";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const display = Instrument_Serif({
  variable: "--font-display",
  subsets: ["latin"],
  weight: "400",
  display: "swap",
});

const mono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Introit — perangkat lunak proyeksi untuk gereja",
  description:
    "Lirik, liturgi, dan doa di layar. Berjalan di peramban, bekerja tanpa internet, tanpa watermark, tanpa langganan.",
  applicationName: "Introit",
  manifest: "/manifest.webmanifest",
  icons: { icon: "/mark.svg", apple: "/mark.svg" },
  appleWebApp: { capable: true, title: "Introit", statusBarStyle: "black" },
  openGraph: {
    title: "Introit",
    description:
      "Perangkat lunak proyeksi untuk gereja. Berjalan di peramban, bekerja tanpa internet.",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#0A0B0E",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="id" className={`${inter.variable} ${display.variable} ${mono.variable}`}>
      <body>
        {children}
        <ServiceWorker />
      </body>
    </html>
  );
}
