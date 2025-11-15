import Image from "next/image";
import Link from "next/link";
import { Instagram, Facebook, Send } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-leaf-500 text-white py-4 px-6 flex justify-between items-center">
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
