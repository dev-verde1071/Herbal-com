"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";

type CartItem = {
  productId: string;
  variantId: string;
  name: string;
  variantLabel: string;
  price: number;
  image?: string | null;
  qty: number;
};

export default function CartPage() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  function loadCart() {
    const stored = JSON.parse(localStorage.getItem("herbal_cart") || "[]");
    setCart(stored);
  }

  function saveCart(updated: CartItem[]) {
    setCart(updated);
    localStorage.setItem("herbal_cart", JSON.stringify(updated));
    window.dispatchEvent(new Event("cart-updated"));
  }

  useEffect(() => {
    loadCart();
  }, []);

  const subtotal = useMemo(() => {
    return cart.reduce(
      (sum, item) => sum + Number(item.price || 0) * Number(item.qty || 0),
      0
    );
  }, [cart]);

  function changeQty(variantId: string, amount: number) {
    const updated = cart
      .map((item) =>
        item.variantId === variantId
          ? { ...item, qty: Math.max(1, item.qty + amount) }
          : item
      )
      .filter((item) => item.qty > 0);

    saveCart(updated);
  }

  function removeItem(variantId: string) {
    saveCart(cart.filter((item) => item.variantId !== variantId));
  }

  function clearCart() {
    saveCart([]);
  }

  async function checkout() {
    if (cart.length === 0) return;

    setLoading(true);

    const res = await fetch("/api/checkout", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        items: cart.map((item) => ({
          variantId: item.variantId,
          qty: item.qty,
        })),
      }),
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
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Herbal Communities
          </p>

          <h1 className="font-display text-5xl flex items-center gap-4">
            <ShoppingCart className="w-10 h-10 text-jungle-300" />
            Your Cart
          </h1>
        </div>

        {cart.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-jungle-900/60">
            <p className="text-5xl mb-5">🛒</p>

            <h2 className="font-display text-3xl mb-3">
              Your cart is empty
            </h2>

            <p className="text-zinc-400 mb-8">
              Add herbs, sea moss, honey, oils, or wellness products to your cart.
            </p>

            <Link
              href="/products"
              className="inline-flex rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-8 py-4 font-semibold transition"
            >
              Shop Products
            </Link>
          </div>
        ) : (
          <div className="grid lg:grid-cols-[1fr_360px] gap-8">
            <div className="space-y-4">
              {cart.map((item) => (
                <div
                  key={item.variantId}
                  className="glass rounded-3xl p-5 border border-jungle-900/60 flex flex-col md:flex-row gap-5"
                >
                  <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden bg-black/30 border border-jungle-900/60">
                    {item.image ? (
                      <Image
                        src={item.image}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-3xl">
                        🌿
                      </div>
                    )}
                  </div>

                  <div className="flex-1">
                    <h2 className="font-semibold text-xl">
                      {item.name}
                    </h2>

                    <p className="text-zinc-400 text-sm mt-1">
                      {item.variantLabel}
                    </p>

                    <p
                      className="font-bold mt-3"
                      style={{ color: "#c89f4f" }}
                    >
                      ${Number(item.price).toFixed(2)}
                    </p>
                  </div>

                  <div className="flex md:flex-col items-center md:items-end justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => changeQty(item.variantId, -1)}
                        className="rounded-lg bg-black/30 border border-jungle-900/60 p-2"
                      >
                        <Minus className="w-4 h-4" />
                      </button>

                      <span className="min-w-8 text-center font-semibold">
                        {item.qty}
                      </span>

                      <button
                        onClick={() => changeQty(item.variantId, 1)}
                        className="rounded-lg bg-black/30 border border-jungle-900/60 p-2"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeItem(item.variantId)}
                      className="text-red-400 hover:text-red-300"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="glass rounded-3xl p-6 border border-jungle-900/60 h-fit sticky top-28">
              <h2 className="font-display text-3xl mb-6">
                Cart Summary
              </h2>

              <div className="space-y-4 text-sm">
                <div className="flex justify-between text-zinc-300">
                  <span>Items</span>
                  <span>{cart.reduce((sum, item) => sum + item.qty, 0)}</span>
                </div>

                <div className="flex justify-between text-zinc-300">
                  <span>Subtotal</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>

                <div className="border-t border-jungle-900/60 pt-4 flex justify-between text-lg font-bold">
                  <span>Total</span>
                  <span style={{ color: "#c89f4f" }}>
                    ${subtotal.toFixed(2)}
                  </span>
                </div>
              </div>

              <button
                onClick={checkout}
                disabled={loading}
                className="w-full mt-8 rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 py-4 font-semibold transition"
              >
                {loading ? "Opening Stripe..." : "Checkout Now"}
              </button>

              <button
                onClick={clearCart}
                className="w-full mt-3 rounded-2xl bg-black/30 hover:bg-red-900/40 border border-jungle-900/60 py-3 text-sm text-zinc-300 transition"
              >
                Clear Cart
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
