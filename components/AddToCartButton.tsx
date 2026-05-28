"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

type Props = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image?: string | null;
  disabled?: boolean;
};

export default function AddToCartButton({
  productId,
  variantId,
  disabled,
}: Props) {
  const router = useRouter();
  const [added, setAdded] = useState(false);
  const [loading, setLoading] = useState(false);

  async function addToCart() {
    setLoading(true);

    const res = await fetch("/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        variantId,
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
      alert(data.error || "Failed to add item to cart.");
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
      className="flex items-center justify-center gap-2 w-full bg-jungle-700 hover:bg-jungle-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
    >
      <ShoppingCart className="w-4 h-4" />
      {loading ? "Adding..." : added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
