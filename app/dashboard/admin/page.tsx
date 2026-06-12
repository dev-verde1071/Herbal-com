import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";

const sections = [
  {
    title: "Retail",
    description:
      "Manage retail storefront products, retail customers, and retail orders.",
    cards: [
      {
        title: "Retail Products",
        href: "/dashboard/admin/products",
        desc: "Manage retail products, variants, images, stock, and featured items",
        emoji: "🛒",
      },
      {
        title: "Retail Orders",
        href: "/dashboard/admin/orders/retail",
        desc: "View retail orders, export CSVs, and manage tracking",
        emoji: "📦",
      },
      {
        title: "Retail Customers",
        href: "/dashboard/admin/customers/retail",
        desc: "View retail customers, carts, and retail order history",
        emoji: "👤",
      },
    ],
  },
  {
    title: "Wholesale",
    description:
      "Manage wholesale products, wholesale customers, applications, and wholesale orders.",
    cards: [
      {
        title: "Wholesale Products",
        href: "/dashboard/admin/wholesale-products",
        desc: "Manage wholesale-only products, pricing, variants, and inventory",
        emoji: "📦",
      },
      {
        title: "Wholesale Orders",
        href: "/dashboard/admin/orders/wholesale",
        desc: "View wholesale orders, export CSVs, and manage tracking",
        emoji: "🚚",
      },
      {
        title: "Wholesale Customers",
        href: "/dashboard/admin/customers/wholesale",
        desc: "View approved wholesale customers, carts, and order history",
        emoji: "🤝",
      },
      {
        title: "Wholesale Applications",
        href: "/dashboard/admin/wholesale",
        desc: "Review, approve, reject, archive, and track wholesale applicants",
        emoji: "📋",
      },
    ],
  },
  {
    title: "Retreats",
    description:
      "Manage retreats, retreat availability, and retreat guest information.",
    cards: [
      {
        title: "Retreats",
        href: "/dashboard/admin/retreats",
        desc: "Manage retreats, dates, pricing, photos, and availability",
        emoji: "🏕️",
      },
      {
      title: "Retreat Orders",
      href: "/dashboard/admin/orders/retreats",
      desc: "View retreat bookings, payments, and retreat order history",
      emoji: "🎟️",
      },
      {
        title: "Guests",
        href: "/dashboard/admin/retreats/guests",
        desc: "View retreat guests, contact details, and booking information",
        emoji: "🧘",
      },
    ],
  },
  {
    title: "Storefront",
    description:
      "Manage public-facing announcements and storefront communication.",
    cards: [
      {
        title: "Announcement Banner",
        href: "/dashboard/admin/banner",
        desc: "Update banner text, colors, emoji, active status, and scroll speed",
        emoji: "📢",
      },
    ],
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
        <div className="mb-12">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin Dashboard
          </p>

          <h1 className="font-display text-5xl md:text-6xl">
            Herbal Communities Admin
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl">
            Manage retail, wholesale, retreats, guests, orders, customers,
            shipping, tracking, and storefront announcements.
          </p>
        </div>

        <div className="space-y-12">
          {sections.map((section) => (
            <section key={section.title}>
              <div className="mb-6">
                <h2 className="font-display text-4xl">
                  {section.title}
                </h2>

                <p className="text-zinc-400 mt-2">
                  {section.description}
                </p>
              </div>

              <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
                {section.cards.map((card) => (
                  <Link
                    key={card.href}
                    href={card.href}
                    className="glass rounded-3xl p-7 border border-jungle-900/60 hover:border-jungle-500/70 transition group"
                  >
                    <div className="text-4xl mb-5">{card.emoji}</div>

                    <h3 className="font-display text-3xl mb-3 group-hover:text-jungle-300 transition">
                      {card.title}
                    </h3>

                    <p className="text-zinc-400 leading-relaxed">
                      {card.desc}
                    </p>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
