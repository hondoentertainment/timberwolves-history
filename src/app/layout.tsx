import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";

import { SiteShell } from "@/components/SiteShell";

import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const defaultSite =
  process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(defaultSite),
  title: {
    default: "Wolves History | Minnesota Timberwolves",
    template: "%s | Wolves History",
  },
  description:
    "Season-by-season Minnesota Timberwolves records, all-time roster lineage, player profiles, and head coach register.",
  openGraph: {
    title: "Wolves History",
    description:
      "Minnesota Timberwolves franchise history: seasons, players, coaches, and stats.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${geistSans.variable} ${geistMono.variable} h-full`}>
      <body className="min-h-full font-sans antialiased selection:bg-emerald-500/25 selection:text-emerald-50">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
