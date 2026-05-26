import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import BannerManager from "./BannerManager";

export default async function AdminBannerPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const banner = await db.banner.findFirst({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Announcement Banner
          </h1>
        </div>

        <BannerManager banner={banner} />
      </div>
    </div>
  );
}
