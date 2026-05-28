import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import ProductForm from "../../products/ProductForm";

export default async function NewWholesaleProductPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            New Wholesale Product
          </h1>

          <p className="text-zinc-400 mt-3">
            Add a wholesale-only product for approved wholesale customers.
          </p>
        </div>

        <ProductForm productMode="WHOLESALE" />
      </div>
    </div>
  );
}
