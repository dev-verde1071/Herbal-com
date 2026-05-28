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
  orderType?: string | null;
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
  trackingCourier?: string | null;
  createdAt: string | Date;
  items: OrderItem[];
};

type Filter = "ALL" | "RETAIL" | "WHOLESALE" | "RETREAT" | "UNSHIPPED" | "TRACKED";

export default function AdminOrderList({ orders }: { orders: Order[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");
  const [loadingOrderId, setLoadingOrderId] = useState<string | null>(null);
  const [trackingInputs, setTrackingInputs] = useState<
    Record<string, { trackingNumber: string; trackingCourier: string }>
  >({});

  const filteredOrders = useMemo(() => {
    const q = search.toLowerCase().trim();

    return orders.filter((order) => {
      const orderType = order.orderType || "RETAIL";

      let matchesFilter = true;

      if (filter === "RETAIL") matchesFilter = orderType === "RETAIL";
      if (filter === "WHOLESALE") matchesFilter = orderType === "WHOLESALE";
      if (filter === "RETREAT") matchesFilter = orderType === "RETREAT";
      if (filter === "UNSHIPPED") matchesFilter = !order.trackingNumber;
      if (filter === "TRACKED") matchesFilter = !!order.trackingNumber;

      const blob = [
        order.id,
        order.email,
        order.shippingName,
        order.shippingLine1,
        order.shippingCity,
        order.shippingState,
        order.shippingPostal,
        order.trackingNumber,
        order.trackingCourier,
        order.orderType,
        order.items.map((item) => item.name).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || blob.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [orders, search, filter]);

  const counts = useMemo(() => {
    return {
      ALL: orders.length,
      RETAIL: orders.filter((order) => (order.orderType || "RETAIL") === "RETAIL").length,
      WHOLESALE: orders.filter((order) => order.orderType === "WHOLESALE").length,
      RETREAT: orders.filter((order) => order.orderType === "RETREAT").length,
      UNSHIPPED: orders.filter((order) => !order.trackingNumber).length,
      TRACKED: orders.filter((order) => !!order.trackingNumber).length,
    };
  }, [orders]);

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
        order.orderType || "RETAIL",
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
        order.trackingCourier,
        order.trackingNumber,
      ].map(csvSafe);
    });

    const header = [
      "Order ID",
      "Order Type",
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
      "Courier",
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

  async function saveTracking(orderId: string) {
    const input = trackingInputs[orderId];

    if (!input?.trackingNumber || !input?.trackingCourier) {
      alert("Please enter both courier and tracking number.");
      return;
    }

    setLoadingOrderId(orderId);

    const res = await fetch(`/api/admin/orders/${orderId}/tracking`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(input),
    });

    const data = await res.json();

    setLoadingOrderId(null);

    if (!res.ok) {
      alert(data.error || "Failed to save tracking.");
      return;
    }

    alert("Tracking saved and customer email sent.");
    router.refresh();
  }

  function updateTrackingInput(orderId: string, key: "trackingNumber" | "trackingCourier", value: string) {
    setTrackingInputs((prev) => ({
      ...prev,
      [orderId]: {
        trackingNumber: prev[orderId]?.trackingNumber || "",
        trackingCourier: prev[orderId]?.trackingCourier || "",
        [key]: value,
      },
    }));
  }

  const filters: Filter[] = ["ALL", "RETAIL", "WHOLESALE", "RETREAT", "UNSHIPPED", "TRACKED"];

  function filterLabel(value: Filter) {
    if (value === "UNSHIPPED") return "Unshipped";
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  function badgeClass(orderType?: string | null) {
    if (orderType === "WHOLESALE") {
      return "border-blue-700/40 bg-blue-900/30 text-blue-300";
    }

    if (orderType === "RETREAT") {
      return "border-amber-700/40 bg-amber-900/30 text-amber-300";
    }

    return "border-jungle-700/40 bg-jungle-900/30 text-jungle-300";
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <div className="grid lg:grid-cols-[1fr_auto_auto] gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search orders by customer, email, address, product, tracking, courier, or order ID..."
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

        <div className="flex flex-wrap gap-3 mt-5">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                filter === status
                  ? "bg-jungle-700 border-jungle-400 text-white"
                  : "bg-black/20 border-jungle-900/60 text-zinc-300 hover:bg-jungle-900/60"
              }`}
            >
              {filterLabel(status)}{" "}
              <span className="text-xs opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>

        <p className="text-zinc-500 text-sm mt-4">
          Showing {filteredOrders.length} of {orders.length} orders.
        </p>
      </div>

      {filteredOrders.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No orders found.
        </div>
      ) : (
        filteredOrders.map((order) => {
          const input = trackingInputs[order.id] || {
            trackingNumber: order.trackingNumber || "",
            trackingCourier: order.trackingCourier || "",
          };

          return (
            <div
              key={order.id}
              className="glass rounded-3xl p-6 border border-jungle-900/60"
            >
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-2">
                    <p className="text-xs uppercase tracking-[0.25em] text-jungle-300">
                      Order
                    </p>

                    <span
                      className={`rounded-full border px-3 py-1 text-xs ${badgeClass(
                        order.orderType
                      )}`}
                    >
                      {order.orderType || "RETAIL"}
                    </span>
                  </div>

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

                <div className="lg:w-[420px]">
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

                          <span>
                            ${Number(item.price * item.qty).toFixed(2)}
                          </span>
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
                      <strong>Courier:</strong> {order.trackingCourier || "—"}
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

                  <div className="mt-4 rounded-2xl bg-black/20 border border-jungle-900/60 p-4 space-y-3">
                    <p className="text-sm font-semibold text-zinc-300">
                      Tracking / Courier
                    </p>

                    <input
                      value={input.trackingCourier}
                      onChange={(e) =>
                        updateTrackingInput(
                          order.id,
                          "trackingCourier",
                          e.target.value
                        )
                      }
                      placeholder="Courier, e.g. USPS, UPS, FedEx"
                      className="w-full rounded-xl bg-black/30 border border-jungle-900/60 px-4 py-3 text-sm outline-none focus:border-jungle-500"
                    />

                    <input
                      value={input.trackingNumber}
                      onChange={(e) =>
                        updateTrackingInput(
                          order.id,
                          "trackingNumber",
                          e.target.value
                        )
                      }
                      placeholder="Tracking number"
                      className="w-full rounded-xl bg-black/30 border border-jungle-900/60 px-4 py-3 text-sm outline-none focus:border-jungle-500"
                    />

                    <button
                      type="button"
                      disabled={loadingOrderId === order.id}
                      onClick={() => saveTracking(order.id)}
                      className="w-full rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-6 py-3 font-semibold transition"
                    >
                      {loadingOrderId === order.id
                        ? "Saving..."
                        : order.trackingNumber
                          ? "Update Tracking & Email"
                          : "Save Tracking & Email"}
                    </button>
                  </div>

                  <button
                    type="button"
                    disabled={
                      loadingOrderId === order.id ||
                      order.shippingStatus === "NOT_REQUIRED"
                    }
                    onClick={() => createEasyshipShipment(order.id)}
                    className="w-full mt-4 rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 disabled:opacity-50 px-6 py-3 font-semibold transition"
                  >
                    {loadingOrderId === order.id
                      ? "Creating Shipment..."
                      : "Create Easyship Shipment"}
                  </button>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
