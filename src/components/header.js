import Link from "next/link";
import { Instagram, Facebook, Send } from "lucide-react";

export default function Header() {
  return (
    <header className="bg-leaf-500 text-white py-4 px-6 flex justify-between items-center">
      <h1 className="text-xl font-bold">Herbal Communities</h1>

      <nav className="flex items-center gap-6">
        <Link href="/" className="hover:underline">Home</Link>
        <Link href="/mission" className="hover:underline">Mission</Link>
        <Link href="/about" className="hover:underline">About</Link>
        <Link href="/team" className="hover:underline">Team</Link>

        <div className="flex items-center gap-4 ml-4">
          <a href="#" target="_blank"><Instagram size={20} /></a>
          <a href="#" target="_blank"><Facebook size={20} /></a>
          <a href="#" target="_blank"><Send size={20} /></a>
        </div>
      </nav>
    </header>
  );
}
