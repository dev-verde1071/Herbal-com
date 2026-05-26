import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import ProductForm from "../ProductForm";

export default async function NewProductPage() {
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
            New Product
          </h1>
        </div>

        <ProductForm />
      </div>
    </div>
  );
}
