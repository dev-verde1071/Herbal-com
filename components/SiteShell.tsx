"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";

export default function SiteShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isAdmin = pathname.startsWith("/dashboard/admin");

  return (
    <>
      {!isAdmin && <ClearanceBanner />}
      {!isAdmin && <Header />}

      <main className="min-h-screen">{children}</main>

      {!isAdmin && <Footer />}
    </>
  );
}
