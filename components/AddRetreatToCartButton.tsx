"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  retreatId: string;
  disabled?: boolean;
};

export default function AddRetreatToCartButton({
  retreatId,
  disabled,
}: Props) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [added, setAdded] = useState(false);

  async function addToCart() {
    setLoading(true);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        retreatId,
        qty: 1,
      }),
    });

    const data = await res.json();

    setLoading(false);

    if (res.status === 401) {
      router.push("/sign-in");
      return;
    }

    if (!res.ok) {
      alert(data.error || "Failed to add retreat to cart.");
      return;
    }

    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={disabled || loading}
      className="flex items-center justify-center gap-2 w-full rounded-2xl bg-jungle-700 hover:bg-jungle-600 disabled:opacity-50 disabled:cursor-not-allowed py-4 font-semibold transition"
    >
      <ShoppingCart className="w-5 h-5" />
      {loading ? "Adding..." : added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
