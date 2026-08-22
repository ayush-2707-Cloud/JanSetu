import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/Providers";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "JanSetu™ (जनसेतु) | India's Universal Citizen GovTech Bridge",
  description: "Enterprise GovTech visual milestone roadmap platform for statutory compliance, legal document drafting, municipal approvals, and official .gov.in procedures.",
  keywords: ["JanSetu", "जनसेतु", "GovTech", "Milestone Roadmap", "Citizen Services", "DigiLocker", "Statutory Compliance", "Smart India Hackathon"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full scroll-smooth">
      <body className={`${inter.className} h-full flex flex-col bg-slate-100 dark:bg-slate-950 font-sans text-slate-900 dark:text-slate-100`}>
        {/* WCAG 2.1 AA Accessibility: Skip to Main Content Link */}
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[100] focus:px-4 focus:py-2 focus:bg-blue-600 focus:text-white focus:font-bold focus:rounded-lg focus:shadow-xl focus:outline-hidden focus:ring-2 focus:ring-blue-400"
        >
          Skip to main content
        </a>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
