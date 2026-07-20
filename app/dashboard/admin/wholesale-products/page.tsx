export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminProductList from "../products/AdminProductList";

export default async function AdminWholesaleProductsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const products = await db.product.findMany({
    where: {
      type: "WHOLESALE",
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: [
      {
        featured: "desc",
      },
      {
        createdAt: "desc",
      },
    ],
  });

  const featuredCount = products.filter(
    (product) => product.featured
  ).length;

  return (
    <div className="min-h-screen px-6 py-12">
      <div className="mx-auto max-w-7xl">
        <div className="mb-10 flex flex-col gap-5 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-jungle-300">
              Admin
            </p>

            <h1 className="font-display text-5xl">
              Wholesale Products
            </h1>

            <p className="mt-3 max-w-3xl text-zinc-400">
              Manage wholesale-only products, pricing, images, variants,
              inventory, and featured placement for the public wholesale page.
            </p>

            <div className="mt-5 flex flex-wrap gap-3 text-sm">
              <span className="rounded-full border border-jungle-900/70 bg-jungle-950/40 px-4 py-2 text-zinc-300">
                {products.length} wholesale product
                {products.length === 1 ? "" : "s"}
              </span>

              <span className="rounded-full border border-jungle-800/70 bg-jungle-900/40 px-4 py-2 text-jungle-300">
                {featuredCount} of 6 featured
              </span>
            </div>
          </div>

          <Link
            href="/dashboard/admin/wholesale-products/new"
            className="rounded-2xl bg-jungle-600 px-6 py-3 font-semibold transition hover:bg-jungle-500"
          >
            + New Wholesale Product
          </Link>
        </div>

        <div className="mb-8 rounded-3xl border border-jungle-900/60 bg-jungle-950/30 p-6">
          <h2 className="text-lg font-semibold text-jungle-300">
            Wholesale Featured Products
          </h2>

          <p className="mt-2 text-sm leading-relaxed text-zinc-400">
            Feature up to six wholesale products. Featured products appear
            beneath the account-access panel on the public wholesale page.
          </p>
        </div>

        <AdminProductList
          products={products as any}
          productType="WHOLESALE"
        />
      </div>
    </div>
  );
}
