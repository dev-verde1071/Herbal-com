"use client";

import Link from "next/link";
import { ChevronDown, Facebook, Instagram, Menu, Send, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";

const navItems = [
  { href: "/", label: "Home" },
  { href: "/mission", label: "Mission" },
  { href: "/about", label: "About" },
  { href: "/team", label: "Team" }
];

const shopItems = [
  { href: "/shop", label: "All Products" },
  { href: "/shop/retail", label: "Retail" },
  { href: "/shop/wholesale", label: "Wholesale" }
];

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [shopOpen, setShopOpen] = useState(false);
  const dropdownRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShopOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="bg-leaf-700 text-white">
        <div className="site-container flex min-h-10 items-center justify-center text-center text-xs sm:text-sm">
          Rooted in nature, guided by community, centered on wellness.
        </div>
      </div>

      <header className="sticky top-0 z-40 border-b border-sand-200 bg-cream/95 backdrop-blur">
        <div className="site-container flex h-20 items-center justify-between gap-4">
          <Link href="/" className="shrink-0">
            <div className="text-lg font-bold tracking-wide text-leaf-700 sm:text-xl">
              Herbal Communities
            </div>
          </Link>

          <nav className="hidden items-center gap-7 lg:flex">
            {navItems.map((item) => (
              <Link key={item.href} href={item.href} className="nav-link">
                {item.label}
              </Link>
            ))}

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setShopOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-sm font-medium text-sand-700 transition hover:text-leaf-700"
              >
                Shop <ChevronDown size={16} />
              </button>

              {shopOpen && (
                <div className="absolute left-0 top-10 min-w-[190px] rounded-2xl border border-sand-200 bg-white p-2 shadow-soft">
                  {shopItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="block rounded-xl px-3 py-2 text-sm text-sand-700 transition hover:bg-sand-50 hover:text-leaf-700"
                      onClick={() => setShopOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </nav>

          <div className="hidden items-center gap-3 lg:flex">
            <a href="#" aria-label="Instagram" className="text-sand-700 transition hover:text-leaf-700">
              <Instagram size={18} />
            </a>
            <a href="#" aria-label="Facebook" className="text-sand-700 transition hover:text-leaf-700">
              <Facebook size={18} />
            </a>
            <a href="#" aria-label="Telegram" className="text-sand-700 transition hover:text-leaf-700">
              <Send size={18} />
            </a>
          </div>

          <button
            type="button"
            className="inline-flex items-center justify-center rounded-xl border border-sand-300 p-2 text-sand-700 lg:hidden"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>

        {mobileOpen && (
          <div className="border-t border-sand-200 bg-white lg:hidden">
            <div className="site-container py-4">
              <nav className="space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="mobile-nav-link"
                    onClick={() => setMobileOpen(false)}
                  >
                    {item.label}
                  </Link>
                ))}

                <div className="pt-2">
                  <p className="px-3 pb-1 text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600">
                    Shop
                  </p>
                  {shopItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      className="mobile-nav-link"
                      onClick={() => setMobileOpen(false)}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </nav>

              <div className="mt-4 flex items-center gap-4 px-3 pb-2">
                <a href="#" aria-label="Instagram" className="text-sand-700 transition hover:text-leaf-700">
                  <Instagram size={18} />
                </a>
                <a href="#" aria-label="Facebook" className="text-sand-700 transition hover:text-leaf-700">
                  <Facebook size={18} />
                </a>
                <a href="#" aria-label="Telegram" className="text-sand-700 transition hover:text-leaf-700">
                  <Send size={18} />
                </a>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
