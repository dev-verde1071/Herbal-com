"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";

export default function CartSync() {
  const { isSignedIn, isLoaded } = useUser();

  useEffect(() => {
    async function syncLocalCart() {
      if (!isLoaded || !isSignedIn) return;

      const raw =
        localStorage.getItem("cart") ||
        localStorage.getItem("herbal-cart") ||
        localStorage.getItem("herbalCommunitiesCart");

      if (!raw) return;

      let items: any[] = [];

      try {
        const parsed = JSON.parse(raw);
        items = Array.isArray(parsed) ? parsed : parsed.items || [];
      } catch {
        return;
      }

      if (!items.length) return;

      for (const item of items) {
        const productId = item.productId;
        const variantId = item.variantId;
        const qty = Number(item.qty || item.quantity || 1);

        if (!productId || !variantId) continue;

        await fetch("/api/cart", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            productId,
            variantId,
            qty,
          }),
        });
      }

      localStorage.removeItem("cart");
      localStorage.removeItem("herbal-cart");
      localStorage.removeItem("herbalCommunitiesCart");

      window.dispatchEvent(new Event("cart-updated"));
    }

    syncLocalCart();
  }, [isLoaded, isSignedIn]);

  return null;
}
