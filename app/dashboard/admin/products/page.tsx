export const dynamic = "force-dynamic";

import Link from "next/link";
import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminProductList from "./AdminProductList";
import ProductImageMigrationButton from "./ProductImageMigrationButton";

export default async function AdminProductsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const products = await db.product.findMany({
    where: {
      type: {
        in: ["RETAIL", "BOTH"],
      },
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

            <h1 className="font-display text-5xl">Retail Products</h1>

            <p className="text-zinc-400 mt-3">
              Manage retail storefront products, images, variants, stock, and
              homepage featured items.
            </p>
          </div>

          <div className="flex flex-col md:flex-row gap-3 md:items-center">
            <ProductImageMigrationButton />

            <Link
              href="/dashboard/admin/products/new"
              className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition text-center"
            >
              + New Retail Product
            </Link>
          </div>
        </div>

        <AdminProductList products={products as any} productType="RETAIL" />
      </div>
    </div>
  );
}
