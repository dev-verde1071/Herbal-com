"use client";

import { usePathname } from "next/navigation";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ClearanceBanner from "@/components/ClearanceBanner";

export default function SiteChrome({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  const isAdminDashboard = pathname?.startsWith("/dashboard/admin");

  if (isAdminDashboard) {
    return <>{children}</>;
  }

  return (
    <>
      <ClearanceBanner />
      <Header />
      {children}
      <Footer />
    </>
  );
}
