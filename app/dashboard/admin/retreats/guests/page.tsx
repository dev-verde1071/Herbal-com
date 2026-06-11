export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";

export default async function RetreatGuestsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const retreatOrders = await db.order.findMany({
    where: {
      orderType: "RETREAT",
    },
    include: {
      items: true,
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

          <h1 className="font-display text-5xl">
            Guests
          </h1>

          <p className="text-zinc-400 mt-3">
            View retreat guest information, contact details, retreat purchases,
            and booking history so guests can be contacted.
          </p>
        </div>

        {retreatOrders.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
            No retreat guests found yet.
          </div>
        ) : (
          <div className="space-y-6">
            {retreatOrders.map((order) => (
              <div
                key={order.id}
                className="glass rounded-3xl p-6 border border-jungle-900/60"
              >
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div>
                    <p className="uppercase tracking-[0.25em] text-jungle-300 text-xs mb-3">
                      Guest Booking
                    </p>

                    <h2 className="font-display text-3xl">
                      {order.shippingName || order.user?.name || "Guest"}
                    </h2>

                    <p className="text-zinc-500 text-sm mt-1">
                      Order #{order.id.slice(-8)} ·{" "}
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    <div className="mt-5 space-y-2 text-sm text-zinc-300">
                      <p>
                        <strong>Email:</strong>{" "}
                        {order.email || order.user?.email || "—"}
                      </p>

                      <p>
                        <strong>Payment Status:</strong> {order.status}
                      </p>

                      <p>
                        <strong>Total Paid:</strong>{" "}
                        <span style={{ color: "#c89f4f" }}>
                          ${Number(order.total || 0).toFixed(2)}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div className="lg:w-[460px] space-y-4">
                    <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                      <h3 className="font-semibold mb-3">
                        Retreat / Booking Items
                      </h3>

                      <div className="space-y-2">
                        {order.items.map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 text-sm text-zinc-300"
                          >
                            <span>
                              {item.name} x{item.qty}
                            </span>

                            <span>
                              ${Number(item.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4 text-sm text-zinc-300">
                      <h3 className="font-semibold mb-3">
                        Contact / Address
                      </h3>

                      <p>{order.shippingName || "—"}</p>

                      <p>{order.shippingLine1 || "—"}</p>

                      {order.shippingLine2 && <p>{order.shippingLine2}</p>}

                      <p>
                        {order.shippingCity || ""}
                        {order.shippingCity && order.shippingState ? ", " : ""}
                        {order.shippingState || ""} {order.shippingPostal || ""}
                      </p>

                      <p>{order.shippingCountry || ""}</p>
                    </div>

                    <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4 text-sm text-zinc-300">
                      <h3 className="font-semibold mb-3">
                        Notes
                      </h3>

                      <p className="text-zinc-500">
                        Guest notes, phone number, emergency contact, dietary
                        restrictions, and retreat intake forms can be added in a
                        future update.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
