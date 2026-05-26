import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminProductList from "./AdminProductList";

export default async function AdminProductsPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const products = await db.product.findMany({
    include: {
      variants: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Products
          </h1>
        </div>

        <AdminProductList products={products} />
      </div>
    </div>
  );
}
