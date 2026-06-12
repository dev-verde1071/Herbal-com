export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminOrderList from "../AdminOrderList";

export default async function AdminRetreatOrdersPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const orders = await db.order.findMany({
    where: {
      orderType: "RETREAT",
    },
    include: {
      items: true,
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

          <h1 className="font-display text-5xl">
            Retreat Orders
          </h1>

          <p className="text-zinc-400 mt-3">
            View retreat bookings, retreat payments, guest orders, and booking
            status.
          </p>
        </div>

        <AdminOrderList orders={orders as any} />
      </div>
    </div>
  );
}
