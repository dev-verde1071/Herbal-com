import type { Metadata } from "next";
import "./globals.css";

import { ClerkProvider } from "@clerk/nextjs";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";

export const metadata: Metadata = {
  title: "Herbal Communities",
  description:
    "Rare herbs, sea moss, stingless bee honey, holistic wellness products, and healing retreats sourced from trusted communities.",
  keywords: [
    "sea moss",
    "melipona honey",
    "herbs",
    "retreats",
    "wellness",
    "holistic",
    "duck flower",
  ],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body className="min-h-screen bg-jungle-gradient text-white">
          <ClearanceBanner />
          <Header />
          <main className="min-h-screen">{children}</main>
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
