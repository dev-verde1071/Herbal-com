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
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-5">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              Admin
            </p>

            <h1 className="font-display text-5xl">
              Wholesale Products
            </h1>

            <p className="text-zinc-400 mt-3">
              Manage wholesale-only products, pricing, images, variants, and
              inventory for approved wholesale customers.
            </p>
          </div>

          <Link
            href="/dashboard/admin/wholesale-products/new"
            className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition"
          >
            + New Wholesale Product
          </Link>
        </div>

        <AdminProductList products={products as any} productType="WHOLESALE" />
      </div>
    </div>
  );
}
