import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import ProductForm from "../ProductForm";

export default async function EditProductPage({
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
    where: { id },
    include: {
      variants: true,
    },
  });

  if (!product) {
    return notFound();
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Edit Product
          </h1>
        </div>

        <ProductForm product={product as any} />
      </div>
    </div>
  );
}
