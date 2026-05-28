"use client";

import { useMemo, useState } from "react";
import Link from "next/link";

type Order = {
  id: string;
  orderType?: string | null;
  total: number;
  status: string;
  trackingNumber?: string | null;
  trackingCourier?: string | null;
  createdAt: string | Date;
  items: {
    id: string;
    name: string;
    qty: number;
    price: number;
  }[];
};

type WholesaleApplication = {
  id: string;
  business: string;
  status: string;
  outreachNeeded?: boolean;
  archived?: boolean;
  createdAt: string | Date;
};

type Cart = {
  id: string;
  items: {
    id: string;
    qty: number;
    product: {
      name: string;
      type: string;
    };
    variant: {
      label: string;
      price: number;
    };
  }[];
};

type Customer = {
  id: string;
  clerkId: string;
  email: string;
  name?: string | null;
  role: string;
  createdAt: string | Date;
  orders: Order[];
  wholesaleApplications: WholesaleApplication[];
  carts: Cart[];
};

type Filter = "ALL" | "RETAIL" | "WHOLESALE" | "HAS_CART" | "HAS_ORDERS";

export default function AdminCustomerList({ users }: { users: Customer[] }) {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("ALL");

  const filteredUsers = useMemo(() => {
    const q = search.toLowerCase().trim();

    return users.filter((user) => {
      const hasWholesaleApproval = user.wholesaleApplications.some(
        (app) => app.status === "APPROVED" && !app.archived
      );

      const hasCart = user.carts.some((cart) => cart.items.length > 0);
      const hasOrders = user.orders.length > 0;

      let matchesFilter = true;

      if (filter === "RETAIL") matchesFilter = !hasWholesaleApproval;
      if (filter === "WHOLESALE") matchesFilter = hasWholesaleApproval;
      if (filter === "HAS_CART") matchesFilter = hasCart;
      if (filter === "HAS_ORDERS") matchesFilter = hasOrders;

      const searchableText = [
        user.name,
        user.email,
        user.role,
        user.clerkId,
        user.orders.map((order) => order.id).join(" "),
        user.wholesaleApplications.map((app) => app.business).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [users, search, filter]);

  const counts = {
    ALL: users.length,
    RETAIL: users.filter(
      (user) =>
        !user.wholesaleApplications.some(
          (app) => app.status === "APPROVED" && !app.archived
        )
    ).length,
    WHOLESALE: users.filter((user) =>
      user.wholesaleApplications.some(
        (app) => app.status === "APPROVED" && !app.archived
      )
    ).length,
    HAS_CART: users.filter((user) =>
      user.carts.some((cart) => cart.items.length > 0)
    ).length,
    HAS_ORDERS: users.filter((user) => user.orders.length > 0).length,
  };

  const filters: Filter[] = [
    "ALL",
    "RETAIL",
    "WHOLESALE",
    "HAS_CART",
    "HAS_ORDERS",
  ];

  function filterLabel(value: Filter) {
    if (value === "HAS_CART") return "Has Cart";
    if (value === "HAS_ORDERS") return "Has Orders";
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search customers by name, email, business, order ID, or Clerk ID..."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />

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
          Showing {filteredUsers.length} of {users.length} customers.
        </p>
      </div>

      {filteredUsers.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No customers found.
        </div>
      ) : (
        filteredUsers.map((user) => {
          const approvedWholesale = user.wholesaleApplications.find(
            (app) => app.status === "APPROVED" && !app.archived
          );

          const cartItems = user.carts.flatMap((cart) => cart.items);
          const totalSpent = user.orders.reduce(
            (sum, order) => sum + Number(order.total || 0),
            0
          );

          return (
            <div
              key={user.id}
              className="glass rounded-3xl p-6 border border-jungle-900/60"
            >
              <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                <div>
                  <div className="flex flex-wrap items-center gap-3 mb-3">
                    <h2 className="font-display text-3xl">
                      {user.name || "Unnamed Customer"}
                    </h2>

                    {approvedWholesale ? (
                      <span className="rounded-full border border-blue-700/40 bg-blue-900/30 px-3 py-1 text-xs text-blue-300">
                        WHOLESALE
                      </span>
                    ) : (
                      <span className="rounded-full border border-jungle-700/40 bg-jungle-900/30 px-3 py-1 text-xs text-jungle-300">
                        RETAIL
                      </span>
                    )}
                  </div>

                  <div className="space-y-2 text-sm text-zinc-300">
                    <p>
                      <strong>Email:</strong> {user.email}
                    </p>

                    <p>
                      <strong>Joined:</strong>{" "}
                      {new Date(user.createdAt).toLocaleString()}
                    </p>

                    <p>
                      <strong>Total Orders:</strong> {user.orders.length}
                    </p>

                    <p>
                      <strong>Total Spent:</strong>{" "}
                      <span style={{ color: "#c89f4f" }}>
                        ${totalSpent.toFixed(2)}
                      </span>
                    </p>

                    <p>
                      <strong>Saved Cart Items:</strong> {cartItems.length}
                    </p>
                  </div>

                  {approvedWholesale && (
                    <div className="mt-5 rounded-2xl bg-blue-950/30 border border-blue-900/50 p-4 text-sm text-blue-200">
                      <p>
                        <strong>Wholesale Business:</strong>{" "}
                        {approvedWholesale.business}
                      </p>

                      <p>
                        <strong>Status:</strong> {approvedWholesale.status}
                      </p>

                      <p>
                        <strong>Outreach:</strong>{" "}
                        {approvedWholesale.outreachNeeded
                          ? "Needed"
                          : "Completed / Not needed"}
                      </p>
                    </div>
                  )}
                </div>

                <div className="xl:w-[520px] space-y-4">
                  <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                    <h3 className="font-semibold mb-3">Recent Orders</h3>

                    {user.orders.length === 0 ? (
                      <p className="text-sm text-zinc-500">No orders yet.</p>
                    ) : (
                      <div className="space-y-3">
                        {user.orders.slice(0, 3).map((order) => (
                          <div
                            key={order.id}
                            className="rounded-xl bg-black/20 p-3 text-sm"
                          >
                            <div className="flex justify-between gap-4">
                              <p className="font-semibold">
                                #{order.id.slice(-8)} ·{" "}
                                {order.orderType || "RETAIL"}
                              </p>

                              <p style={{ color: "#c89f4f" }}>
                                ${Number(order.total).toFixed(2)}
                              </p>
                            </div>

                            <p className="text-zinc-500 text-xs mt-1">
                              {new Date(order.createdAt).toLocaleString()}
                            </p>

                            <p className="text-zinc-400 text-xs mt-1">
                              Tracking:{" "}
                              {order.trackingCourier && order.trackingNumber
                                ? `${order.trackingCourier} ${order.trackingNumber}`
                                : "Not added"}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    <Link
                      href="/dashboard/admin/orders"
                      className="inline-flex mt-4 text-jungle-300 hover:text-white text-sm"
                    >
                      View Orders
                    </Link>
                  </div>

                  <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                    <h3 className="font-semibold mb-3">Saved Cart</h3>

                    {cartItems.length === 0 ? (
                      <p className="text-sm text-zinc-500">Cart is empty.</p>
                    ) : (
                      <div className="space-y-2">
                        {cartItems.slice(0, 5).map((item) => (
                          <div
                            key={item.id}
                            className="flex justify-between gap-4 text-sm text-zinc-300"
                          >
                            <span>
                              {item.product.name} - {item.variant.label} x
                              {item.qty}
                            </span>

                            <span>
                              ${Number(item.variant.price * item.qty).toFixed(2)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })
      )}
    </div>
  );
}
