import type { Metadata } from "next";
import "./globals.css";
import SiteShell from "@/components/SiteShell";

export const metadata: Metadata = {
  title: "Herbal Communities",
  description:
    "Rare herbs, sea moss, stingless bee honey, wellness products, and retreats.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-jungle-gradient text-white">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
