"use client";

import { useEffect, useState } from "react";

type Props = {
  variantId?: string;
  retreatId?: string;
};

export default function CartUrgencyNote({ variantId, retreatId }: Props) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    async function loadCounts() {
      try {
        const res = await fetch("/api/cart-counts", {
          cache: "no-store",
        });

        if (!res.ok) return;

        const data = await res.json();

        if (variantId) {
          setCount(Number(data.variants?.[variantId] || 0));
        }

        if (retreatId) {
          setCount(Number(data.retreats?.[retreatId] || 0));
        }
      } catch {
        setCount(0);
      }
    }

    loadCounts();
  }, [variantId, retreatId]);

  if (count <= 0) return null;

  return (
    <p className="mt-2 text-xs text-amber-300">
      {count === 1
        ? "1 person has this in their cart right now."
        : `${count} people have this in their carts right now.`}
    </p>
  );
}
