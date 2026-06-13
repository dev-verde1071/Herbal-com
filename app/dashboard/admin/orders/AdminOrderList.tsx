"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
  image?: string | null;
};

type Order = {
  id: string;
  orderType?: string | null;
  status: string;
  total: number;
  email?: string | null;

  shippingName?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostal?: string | null;
  shippingCountry?: string | null;

  trackingNumber?: string | null;
  trackingCourier?: string | null;
  shippingStatus?: string | null;

  createdAt: string | Date;
  items: OrderItem[];
};

export default function AdminOrderList({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const [savingId, setSavingId] = useState<string | null>(null);
  const [creatingShipmentId, setCreatingShipmentId] = useState<string | null>(
    null
  );

  const [trackingDrafts, setTrackingDrafts] = useState<
    Record<string, { trackingCourier: string; trackingNumber: string }>
  >(
    orders.reduce((acc, order) => {
      acc[order.id] = {
        trackingCourier: order.trackingCourier || "",
        trackingNumber: order.trackingNumber || "",
      };

      return acc;
    }, {} as Record<string, { trackingCourier: string; trackingNumber: string }>)
  );

  function updateDraft(
    orderId: string,
    key: "trackingCourier" | "trackingNumber",
    value: string
  ) {
    setTrackingDrafts((prev) => ({
      ...prev,
      [orderId]: {
        ...prev[orderId],
        [key]: value,
      },
    }));
  }

  async function saveTracking(orderId: string) {
    const draft = trackingDrafts[orderId];

    if (!draft) return;

    setSavingId(orderId);

    const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        trackingCourier: draft.trackingCourier,
        trackingNumber: draft.trackingNumber,
      }),
    });

    const data = await res.json().catch(() => null);

    setSavingId(null);

    if (!res.ok) {
      alert(data?.error || "Failed to save tracking.");
      return;
    }

    router.refresh();
  }

  async function createEasyshipShipment(orderId: string) {
    setCreatingShipmentId(orderId);

    const res = await fetch("/api/admin/easyship/create-shipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json().catch(() => null);

    setCreatingShipmentId(null);

    if (!res.ok) {
      alert(data?.error || "Failed to create Easyship shipment.");
      return;
    }

    router.refresh();
  }

  if (!orders.length) {
    return (
      <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
        No orders found.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {orders.map((order) => {
        const isRetreatOrder = order.orderType === "RETREAT";

        return (
          <div
            key={order.id}
            className="glass rounded-3xl p-6 border border-jungle-900/60"
          >
            <div className="grid lg:grid-cols-[1fr_420px] gap-8">
              <div>
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs">
                    Order
                  </p>

                  <span
                    className={`rounded-full px-3 py-1 text-xs border ${
                      isRetreatOrder
                        ? "bg-amber-900/40 border-amber-600/50 text-amber-300"
                        : order.orderType === "WHOLESALE"
                          ? "bg-blue-900/40 border-blue-600/50 text-blue-300"
                          : "bg-jungle-900/40 border-jungle-600/50 text-jungle-300"
                    }`}
                  >
                    {order.orderType || "RETAIL"}
                  </span>
                </div>

                <h2 className="font-display text-3xl mb-2">
                  #{order.id.slice(-8)}
                </h2>

                <p className="text-zinc-500 text-sm mb-6">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="space-y-3 text-sm text-zinc-300">
                  <p>
                    <strong>Email:</strong> {order.email || "—"}
                  </p>

                  <p>
                    <strong>{isRetreatOrder ? "Guest" : "Ship To"}:</strong>{" "}
                    {order.shippingName || "—"}
                  </p>

                  {!isRetreatOrder && (
                    <>
                      <p>{order.shippingLine1 || ""}</p>

                      {order.shippingLine2 && <p>{order.shippingLine2}</p>}

                      <p>
                        {order.shippingCity || ""}
                        {order.shippingCity && order.shippingState ? ", " : ""}
                        {order.shippingState || ""} {order.shippingPostal || ""}
                      </p>

                      <p>{order.shippingCountry || ""}</p>
                    </>
                  )}

                  {isRetreatOrder && (
                    <div className="mt-6 rounded-2xl bg-black/20 border border-amber-900/50 p-4">
                      <h3 className="font-semibold text-amber-300 mb-2">
                        Retreat Booking
                      </h3>

                      <p className="text-zinc-400">
                        This is a retreat booking. No shipping, tracking, courier,
                        or Easyship label is required.
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                  <h3 className="font-semibold mb-4">Items</h3>

                  <div className="space-y-3">
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

                  <div className="flex justify-between gap-4 mt-6 pt-4 border-t border-jungle-900/60 font-semibold">
                    <span>Total</span>

                    <span style={{ color: "#c89f4f" }}>
                      ${Number(order.total || 0).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4 space-y-2 text-sm">
                  <p>
                    <strong>Payment:</strong> {order.status}
                  </p>

                  <p>
                    <strong>
                      {isRetreatOrder ? "Booking Status" : "Shipping"}:
                    </strong>{" "}
                    {isRetreatOrder
                      ? "BOOKED"
                      : order.shippingStatus || "NOT_CREATED"}
                  </p>

                  {!isRetreatOrder && (
                    <>
                      <p>
                        <strong>Courier:</strong>{" "}
                        {order.trackingCourier || "—"}
                      </p>

                      <p>
                        <strong>Tracking:</strong>{" "}
                        {order.trackingNumber || "—"}
                      </p>
                    </>
                  )}
                </div>

                {!isRetreatOrder && (
                  <>
                    <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                      <h3 className="font-semibold mb-4">
                        Tracking / Courier
                      </h3>

                      <div className="space-y-3">
                        <input
                          value={
                            trackingDrafts[order.id]?.trackingCourier || ""
                          }
                          onChange={(e) =>
                            updateDraft(
                              order.id,
                              "trackingCourier",
                              e.target.value
                            )
                          }
                          placeholder="Courier, e.g. USPS, UPS, FedEx"
                          className="w-full rounded-xl bg-black/30 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
                        />

                        <input
                          value={
                            trackingDrafts[order.id]?.trackingNumber || ""
                          }
                          onChange={(e) =>
                            updateDraft(
                              order.id,
                              "trackingNumber",
                              e.target.value
                            )
                          }
                          placeholder="Tracking number"
                          className="w-full rounded-xl bg-black/30 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
                        />

                        <button
                          type="button"
                          onClick={() => saveTracking(order.id)}
                          disabled={savingId === order.id}
                          className="w-full rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 py-3 font-semibold transition"
                        >
                          {savingId === order.id
                            ? "Saving..."
                            : "Save Tracking & Email"}
                        </button>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => createEasyshipShipment(order.id)}
                      disabled={creatingShipmentId === order.id}
                      className="w-full rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 disabled:opacity-50 py-4 font-semibold transition"
                    >
                      {creatingShipmentId === order.id
                        ? "Creating Shipment..."
                        : "Create Easyship Shipment"}
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
