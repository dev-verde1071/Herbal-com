"use client";

import Link from "next/link";
import { useState } from "react";
import { ShoppingCart, User, Instagram, Facebook, Send } from "lucide-react";
import AuthModal from "@/components/auth-modal";

export default function Header() {
  const [authOpen, setAuthOpen] = useState(false);

  return (
    <header className="border-b bg-brand-50 text-leaf-700">
      <div className="container mx-auto flex items-center justify-between py-4 px-4">
        <Link
          href="/"
          className="text-2xl font-bold text-leaf-700 hover:text-leaf-600 transition"
        >
          Herbal Communities
        </Link>

        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link href="/products" className="hover:text-leaf-600">Products</Link>
          <Link href="/tours" className="hover:text-leaf-600">Tours</Link>
          <Link href="/reviews" className="hover:text-leaf-600">Reviews</Link>
          <Link href="/team" className="hover:text-leaf-600">Team</Link>
          <Link href="/about" className="hover:text-leaf-600">About</Link>
        </nav>

        <div className="flex items-center gap-4">
          <Link href="/cart" className="p-2 hover:text-leaf-600">
            <ShoppingCart className="w-5 h-5" />
          </Link>

          <button
            onClick={() => setAuthOpen(true)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-leaf-500 text-white text-sm hover:bg-leaf-600 transition"
          >
            <User className="w-4 h-4" />
            Login
          </button>

          <div className="flex items-center gap-3 ml-2 text-leaf-600">
            <a
              href="https://instagram.com/herbalcommunities"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-leaf-500"
            >
              <Instagram className="w-5 h-5" />
            </a>
            <a
              href="https://t.me/herbalcommunities"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-leaf-500"
            >
              <Send className="w-5 h-5" />
            </a>
            <a
              href="https://facebook.com/herbalcommunities"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-leaf-500"
            >
              <Facebook className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>

      {authOpen && <AuthModal onClose={() => setAuthOpen(false)} />}
    </header>
  );
}
