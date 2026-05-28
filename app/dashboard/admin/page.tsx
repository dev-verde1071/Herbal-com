import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

export default async function AdminDashboardPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const cards = [
    {
      title: "Products",
      href: "/dashboard/admin/products",
      desc: "Manage storefront products",
      emoji: "🌿",
    },
    {
      title: "Retreats",
      href: "/dashboard/admin/retreats",
      desc: "Manage retreat listings",
      emoji: "🏕️",
    },
    {
      title: "Wholesale",
      href: "/dashboard/admin/wholesale",
      desc: "Review wholesale applications",
      emoji: "🍯",
    },
    {
      title: "Wholesale Products",
      href: "/dashboard/admin/wholesale-products",
      desc: "Manage wholesale-only products and pricing",
      emoji: "📦",
    },
    {
      title: "Banner",
      href: "/dashboard/admin/banner",
      desc: "Manage top announcement banner",
      emoji: "📢",
    },
    {
      title: "Orders",
      href: "/dashboard/admin/orders",
      desc: "View orders, export CSV, and create shipping labels",
      emoji: "📦",
    },
  ];

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Herbal Communities
          </p>

          <h1 className="font-display text-5xl mb-4">
            Admin Dashboard
          </h1>

          <p className="text-zinc-400">
            Manage products, retreats, wholesale applications, and site
            content.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="glass rounded-3xl p-8 border border-jungle-900/60 hover:border-jungle-500/40 transition group"
            >
              <div className="text-5xl mb-6">
                {card.emoji}
              </div>

              <h2 className="font-display text-3xl mb-3 group-hover:text-jungle-300 transition">
                {card.title}
              </h2>

              <p className="text-zinc-400 text-sm leading-relaxed">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
