export const dynamic = "force-dynamic";

import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductForm from "../../products/ProductForm";

export default async function EditWholesaleProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const { id } = await params;

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!product) {
    notFound();
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Edit Wholesale Product
          </h1>

          <p className="text-zinc-400 mt-3">
            Update wholesale product details, images, variants, and inventory.
          </p>
        </div>

        <ProductForm product={product as any} productMode="WHOLESALE" />
      </div>
    </div>
  );
}
