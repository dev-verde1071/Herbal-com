import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";

export const metadata: Metadata = {
  title: "Herbal Communities",
  description: "Rare herbs, sea moss, stingless bee honey, wellness products, and retreats.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-jungle-gradient text-white">
        <ClearanceBanner />
        <Header />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
