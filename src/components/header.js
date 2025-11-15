"use client";

import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Send, ChevronDown } from "lucide-react";
import { useState } from "react";

export default function Header() {
  const [open, setOpen] = useState(false);

  return (
    <header className="bg-leaf-500 text-white py-4 px-6 flex justify-between items-center relative">
      {/* Left side: Logo + Title */}
      <div className="flex items-center gap-3">
        <Image
          src="/logo.png"
          alt="Herbal Communities Logo"
          width={40}
          height={40}
          className="rounded-full"
        />
        <h1 className="text-xl font-bold">Herbal Communities</h1>
      </div>

      {/* Navigation */}
      <nav className="flex items-center gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/mission" className="hover:underline">Mission</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/team" className="hover:underline">Team</Link>

        {/* ============================= */}
        {/*         SHOP DROPDOWN         */}
        {/* ============================= */}
        <div className="relative">
          <button
            onClick={() => setOpen(!open)}
            className="flex items-center gap-1 hover:underline font-semibold"
          >
            Shop <ChevronDown size={18} />
          </button>

          {open && (
            <div className="absolute right-0 mt-2 bg-white text-black rounded shadow-md w-40 z-50">
              <Link
                href="/products"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Products
              </Link>

              <Link
                href="/retreats"
                className="block px-4 py-2 hover:bg-gray-200"
                onClick={() => setOpen(false)}
              >
                Retreats
              </Link>
            </div>
          )}
        </div>

        {/* Social Icons */}
        <div className="flex items-center gap-4 ml-4">
          <a
            href="https://www.instagram.com/herbcom_/"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Instagram size={20} />
          </a>

          <a
            href="https://www.facebook.com/bigsosaOT"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Facebook size={20} />
          </a>

          <a
            href="https://t.me/c/2102817925/2"
            target="_blank"
            rel="noopener noreferrer"
          >
            <Send size={20} />
          </a>
        </div>
      </nav>
    </header>
  );
}
