import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";

export const metadata: Metadata = {
  title: "Herbal Communities",
  description:
    "Premium herbs, sea moss, natural wellness products, wholesale access, and healing retreats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <ClearanceBanner />
          <Header />
          {children}
          <Footer />
        </body>
      </html>
    </ClerkProvider>
  );
}
