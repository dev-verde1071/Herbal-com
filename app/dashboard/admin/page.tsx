import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

const cards = [
  {
    title: "Retail Products",
    href: "/dashboard/admin/products",
    desc: "Manage retail storefront products, variants, images, stock, and featured items",
    emoji: "🛒",
  },
  {
    title: "Wholesale Products",
    href: "/dashboard/admin/wholesale-products",
    desc: "Manage wholesale-only products, pricing, variants, and inventory",
    emoji: "📦",
  },
  {
    title: "Retreats",
    href: "/dashboard/admin/retreats",
    desc: "Manage retreats, dates, pricing, photos, and availability",
    emoji: "🏕️",
  },
  {
    title: "Wholesale Applications",
    href: "/dashboard/admin/wholesale",
    desc: "Review, approve, reject, archive, and track wholesale applicants",
    emoji: "🤝",
  },
  {
    title: "Orders",
    href: "/dashboard/admin/orders",
    desc: "View retail and wholesale orders, export CSVs, and manage tracking",
    emoji: "🚚",
  },
  {
    title: "Announcement Banner",
    href: "/dashboard/admin/banner",
    desc: "Update banner text, colors, emoji, active status, and scroll speed",
    emoji: "📢",
  },
];

export default async function AdminDashboardPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin Dashboard
          </p>

          <h1 className="font-display text-5xl md:text-6xl">
            Herbal Communities Admin
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl">
            Manage products, wholesale access, retreats, orders, shipping,
            tracking, and storefront announcements.
          </p>
        </div>

        <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
          {cards.map((card) => (
            <Link
              key={card.href}
              href={card.href}
              className="glass rounded-3xl p-7 border border-jungle-900/60 hover:border-jungle-500/70 transition group"
            >
              <div className="text-4xl mb-5">{card.emoji}</div>

              <h2 className="font-display text-3xl mb-3 group-hover:text-jungle-300 transition">
                {card.title}
              </h2>

              <p className="text-zinc-400 leading-relaxed">
                {card.desc}
              </p>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
