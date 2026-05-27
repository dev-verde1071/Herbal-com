"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type OrderItem = {
  id: string;
  name: string;
  price: number;
  qty: number;
};

type Order = {
  id: string;
  stripeSessionId?: string | null;
  status: string;
  total: number;
  currency: string;
  email?: string | null;
  shippingName?: string | null;
  shippingLine1?: string | null;
  shippingLine2?: string | null;
  shippingCity?: string | null;
  shippingState?: string | null;
  shippingPostal?: string | null;
  shippingCountry?: string | null;
  shippingStatus?: string | null;
  easyshipShipmentId?: string | null;
  easyshipLabelUrl?: string | null;
  trackingNumber?: string | null;
  createdAt: string | Date;
  items: OrderItem[];
};

export default function AdminOrderList({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    if (!q) return orders;

    return orders.filter((order) => {
      const blob = [
        order.id,
        order.email,
        order.shippingName,
        order.shippingLine1,
        order.shippingCity,
        order.shippingState,
        order.shippingPostal,
        order.trackingNumber,
        order.items.map((item) => item.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return blob.includes(q);
    });
  }, [orders, search]);

  function csvSafe(value: any) {
    const text = value === null || value === undefined ? "" : String(value);
    return `"${text.replace(/"/g, '""')}"`;
  }

  function exportCsv() {
    const rows = filteredOrders.map((order) => {
      const items = order.items
        .map((item) => `${item.name} x${item.qty}`)
        .join("; ");

      return [
        order.id,
        order.createdAt,
        order.email,
        order.shippingName,
        order.shippingLine1,
        order.shippingLine2,
        order.shippingCity,
        order.shippingState,
        order.shippingPostal,
        order.shippingCountry,
        items,
        order.total,
        order.status,
        order.shippingStatus,
        order.trackingNumber,
      ].map(csvSafe);
    });

    const header = [
      "Order ID",
      "Created At",
      "Customer Email",
      "Shipping Name",
      "Address Line 1",
      "Address Line 2",
      "City",
      "State",
      "Postal Code",
      "Country",
      "Items",
      "Total",
      "Payment Status",
      "Shipping Status",
      "Tracking Number",
    ].map(csvSafe);

    const csv = [header, ...rows].map((row) => row.join(",")).join("\n");

    const blob = new Blob([csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");

    a.href = url;
    a.download = `herbal-communities-orders-${new Date()
      .toISOString()
      .slice(0, 10)}.csv`;

    a.click();
    URL.revokeObjectURL(url);
  }

  async function createEasyshipShipment(orderId: string) {
    setLoadingOrderId(orderId);

    const res = await fetch("/api/admin/easyship/create-shipment", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId }),
    });

    const data = await res.json();

    setLoadingOrderId(null);

    if (!res.ok) {
      alert(data.error || "Failed to create Easyship shipment.");
      return;
    }

    alert("Easyship shipment created.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <div className="grid lg:grid-cols-[1fr_auto_auto] gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by customer, email, address, product, tracking, or order ID..."
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />

          <button
            type="button"
            onClick={exportCsv}
            className="rounded-2xl bg-jungle-700 hover:bg-jungle-600 px-6 py-3 font-semibold transition"
          >
            Export CSV
          </button>

          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
          >
            Refresh
          </button>
        </div>

        <p className="text-zinc-500 text-sm mt-3">
          Showing {filteredOrders.length} of {orders.length} orders.
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No orders found.
        </div>
      ) : (
        filteredOrders.map((order) => (
          <div
            key={order.id}
            className="glass rounded-3xl p-6 border border-jungle-900/60"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <p className="text-xs uppercase tracking-[0.25em] text-jungle-300 mb-2">
                  Order
                </p>

                <h2 className="font-display text-3xl">
                  #{order.id.slice(-8)}
                </h2>

                <p className="text-zinc-500 text-sm mt-1">
                  {new Date(order.createdAt).toLocaleString()}
                </p>

                <div className="mt-5 space-y-2 text-sm text-zinc-300">
                  <p>
                    <strong>Email:</strong> {order.email || "—"}
                  </p>

                  <p>
                    <strong>Ship To:</strong> {order.shippingName || "—"}
                  </p>

                  <p>
                    {order.shippingLine1}
                    {order.shippingLine2 ? `, ${order.shippingLine2}` : ""}
                    <br />
                    {order.shippingCity}, {order.shippingState}{" "}
                    {order.shippingPostal}
                    <br />
                    {order.shippingCountry}
                  </p>
                </div>
              </div>

              <div className="lg:w-96">
                <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                  <h3 className="font-semibold mb-3">Items</h3>

                  <div className="space-y-2">
                    {order.items.map((item) => (
                      <div
                        key={item.id}
                        className="flex justify-between gap-4 text-sm text-zinc-300"
                      >
                        <span>
                          {item.name} x{item.qty}
                        </span>

                        <span>${Number(item.price * item.qty).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="border-t border-jungle-900/60 mt-4 pt-4 flex justify-between font-bold">
                    <span>Total</span>
                    <span style={{ color: "#c89f4f" }}>
                      ${Number(order.total).toFixed(2)}
                    </span>
                  </div>
                </div>

                <div className="mt-4 rounded-2xl bg-black/20 border border-jungle-900/60 p-4 text-sm space-y-2">
                  <p>
                    <strong>Payment:</strong> {order.status}
                  </p>

                  <p>
                    <strong>Shipping:</strong>{" "}
                    {order.shippingStatus || "NOT_CREATED"}
                  </p>

                  <p>
                    <strong>Tracking:</strong> {order.trackingNumber || "—"}
                  </p>

                  {order.easyshipLabelUrl && (
                    <a
                      href={order.easyshipLabelUrl}
                      target="_blank"
                      className="inline-flex mt-2 text-jungle-300 hover:text-white"
                    >
                      Open Label
                    </a>
                  )}
                </div>

                <button
                  type="button"
                  disabled={
                    loadingOrderId === order.id ||
                    order.shippingStatus === "NOT_REQUIRED"
                  }
                  onClick={() => createEasyshipShipment(order.id)}
                  className="w-full mt-4 rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-6 py-3 font-semibold transition"
                >
                  {loadingOrderId === order.id
                    ? "Creating Shipment..."
                    : "Create Easyship Shipment"}
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
