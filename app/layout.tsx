import type { Metadata } from "next";
import { ClerkProvider } from "@clerk/nextjs";
import "./globals.css";
import SiteChrome from "@/components/SiteChrome";
import CartSync from "@/components/CartSync";

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
    <html lang="en">
      <body>
        <ClerkProvider>
          <CartSync />
          <SiteChrome>{children}</SiteChrome>
        </ClerkProvider>
      </body>
    </html>
  );
}
