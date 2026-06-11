"use client";

import { useState } from "react";

type Props = {
  retreatId: string;
  disabled?: boolean;
};

export default function BuyRetreatNowButton({
  retreatId,
  disabled,
}: Props) {
  const [loading, setLoading] = useState(false);

  async function buyNow() {
    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retreatId,
      }),
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
      onClick={buyNow}
      disabled={disabled || loading}
      className="w-full rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 disabled:opacity-50 disabled:cursor-not-allowed py-4 font-semibold transition"
    >
      {loading ? "Opening Checkout..." : "Buy Now"}
    </button>
  );
}
