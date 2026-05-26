"use client";

import { useState } from "react";

export default function WholesaleOrderButton({
  variantId,
  disabled,
}: {
  variantId: string;
  disabled?: boolean;
}) {
  const [loading, setLoading] = useState(false);

  async function checkout() {
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ variantId }),
    });

    const data = await res.json();

    if (data.url) {
      window.location.href = data.url;
    } else {
      alert(data.error || "Checkout failed.");
      setLoading(false);
    }
  }

  return (
    <button
      onClick={checkout}
      disabled={disabled || loading}
      className="w-full rounded-xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 disabled:cursor-not-allowed px-4 py-3 text-sm font-semibold transition"
    >
      {loading ? "Redirecting..." : "Order Wholesale"}
    </button>
  );
}
