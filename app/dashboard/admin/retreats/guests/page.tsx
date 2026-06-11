export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import RetreatGuestManager from "./RetreatGuestManager";

export default async function RetreatGuestsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const guests = await db.retreatGuest.findMany({
    include: {
      retreat: true,
      order: true,
      orderItem: true,
      user: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin / Retreats
          </p>

          <h1 className="font-display text-5xl">Guests</h1>

          <p className="text-zinc-400 mt-3">
            View and update retreat guest contact details, emergency contact,
            dietary restrictions, medical notes, travel notes, and admin notes.
          </p>
        </div>

        <RetreatGuestManager guests={guests as any} />
      </div>
    </div>
  );
}
