import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import WholesaleApplicationManager from "./WholesaleApplicationManager";

export default async function AdminWholesalePage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const applications = await db.wholesaleApplication.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Wholesale Applications
          </h1>
        </div>

        <WholesaleApplicationManager applications={applications} />
      </div>
    </div>
  );
}
