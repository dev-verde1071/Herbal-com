"use client";

import { useState } from "react";
import { ShoppingCart } from "lucide-react";

type Props = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image?: string | null;
  disabled?: boolean;
};

type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image?: string | null;
  qty: number;
};

export default function AddToCartButton({
  productId,
  variantId,
  name,
  variantLabel,
  price,
  image,
  disabled,
}: Props) {
  const [added, setAdded] = useState(false);

  function addToCart() {
    const existing: CartItem[] = JSON.parse(
      localStorage.getItem("herbal_cart") || "[]"
    );

    const found = existing.find((item) => item.variantId === variantId);

    let updated: CartItem[];

    if (found) {
      updated = existing.map((item) =>
        item.variantId === variantId
          ? { ...item, qty: item.qty + 1 }
          : item
      );
    } else {
      updated = [
        ...existing,
        {
          productId,
          variantId,
          name,
          variantLabel,
          price,
          image,
          qty: 1,
        },
      ];
    }

    localStorage.setItem("herbal_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));

    setAdded(true);
    setTimeout(() => setAdded(false), 1200);
  }

  return (
    <button
      type="button"
      onClick={addToCart}
      disabled={disabled}
      className="flex items-center justify-center gap-2 w-full bg-jungle-700 hover:bg-jungle-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition"
    >
      <ShoppingCart className="w-4 h-4" />
      {added ? "Added to Cart" : "Add to Cart"}
    </button>
  );
}
