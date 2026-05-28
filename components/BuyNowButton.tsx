"use client";

import { useState } from "react";

type Props = {
  variantId: string;
  disabled?: boolean;
};

export default function BuyNowButton({ variantId, disabled }: Props) {
  const [loading, setLoading] = useState(false);

  async function buyNow() {
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
      return;
    }

    alert(data.error || "Checkout failed.");
    setLoading(false);
  }

  return (
    <button
      type="button"
      disabled={disabled || loading}
      onClick={buyNow}
      className="w-full rounded-xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 py-3.5 font-semibold transition disabled:opacity-50"
    >
      {loading ? "Opening Checkout..." : "Buy Now"}
    </button>
  );
}
