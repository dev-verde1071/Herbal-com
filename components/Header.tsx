"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Menu, X, ShoppingCart } from "lucide-react";

const nav = [
  { href: "/", label: "Home" },
  { href: "/products", label: "Products" },
  { href: "/retreats", label: "Retreats" },
  { href: "/wholesale", label: "Wholesale" },
  { href: "/reviews", label: "Reviews" },
  { href: "/about", label: "About" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const [cartCount, setCartCount] = useState(0);

  function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem("herbal_cart") || "[]");
    const count = cart.reduce(
      (sum: number, item: any) => sum + Number(item.qty || 0),
      0
    );
    setCartCount(count);
  }

  useEffect(() => {
    updateCartCount();

    window.addEventListener("cart-updated", updateCartCount);
    window.addEventListener("storage", updateCartCount);

    return () => {
      window.removeEventListener("cart-updated", updateCartCount);
      window.removeEventListener("storage", updateCartCount);
    };
  }, []);

  return (
    <header className="sticky top-0 z-50 border-b border-jungle-800/40 glass-dark">
      <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3">
          <div className="w-11 h-11 rounded-2xl bg-gradient-to-br from-jungle-400 to-jungle-700 flex items-center justify-center text-xl">
            🌿
          </div>

          <div>
            <p className="font-display text-xl font-semibold leading-none">
              Herbal Communities
            </p>

            <p className="text-xs uppercase tracking-[0.25em] text-jungle-300 mt-1">
              Wellness & Retreats
            </p>
          </div>
        </Link>

        <nav className="hidden lg:flex items-center gap-8">
          {nav.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm text-zinc-300 hover:text-white transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-4">
          <Link
            href="/cart"
            className="relative p-3 rounded-xl hover:bg-jungle-800/40 transition"
            aria-label="Cart"
          >
            <ShoppingCart className="w-5 h-5" />

            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-jungle-500 text-[11px] font-bold flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2">
          {open ? <X /> : <Menu />}
        </button>
      </div>

      {open && (
        <div className="lg:hidden border-t border-jungle-800/40 bg-jungle-950">
          <div className="px-6 py-6 flex flex-col gap-5">
            {nav.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-zinc-300 hover:text-white transition"
              >
                {item.label}
              </Link>
            ))}

            <Link
              href="/cart"
              onClick={() => setOpen(false)}
              className="flex items-center justify-between text-zinc-300 hover:text-white transition"
            >
              <span>Cart</span>
              <span className="rounded-full bg-jungle-700 px-2 py-0.5 text-xs">
                {cartCount}
              </span>
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
