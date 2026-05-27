"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";

type Variant = {
  id: string;
  label: string;
  price: number;
  qty: number;
  inStock: boolean;
};

type Product = {
  id: string;
  name: string;
  slug: string;
  category: string;
  active: boolean;
  featured: boolean;
  variants: Variant[];
};

type Props = {
  products: Product[];
};

export default function AdminProductList({ products }: Props) {
  const router = useRouter();

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product?")) return;

    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <div className="glass rounded-3xl p-8 border border-jungle-900/60">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
        <h2 className="font-display text-3xl">
          Product Catalog
        </h2>

        <button
          type="button"
          onClick={() => router.refresh()}
          className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-5 py-3 font-semibold transition"
        >
          Refresh List
        </button>

        <Link
          href="/dashboard/admin/products/new"
          className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition"
        >
          + New Product
        </Link>
      </div>

      {products.length === 0 ? (
        <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-10 text-center text-zinc-400">
          No products found yet.
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px]">
            <thead>
              <tr className="border-b border-jungle-900/60 text-left text-sm text-zinc-400">
                <th className="pb-4">Name</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Variants</th>
                <th className="pb-4">Qty</th>
                <th className="pb-4">Featured</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {products.map((product) => {
                const totalQty = product.variants.reduce(
                  (sum, variant) => sum + Number(variant.qty || 0),
                  0
                );

                return (
                  <tr
                    key={product.id}
                    className="border-b border-jungle-900/40"
                  >
                    <td className="py-5">
                      <div>
                        <p className="font-semibold text-white">
                          {product.name}
                        </p>

                        <p className="text-xs text-zinc-500 mt-1">
                          /products/{product.slug}
                        </p>
                      </div>
                    </td>

                    <td className="py-5 text-zinc-300">
                      {product.category}
                    </td>

                    <td className="py-5 text-zinc-300">
                      {product.variants.length}
                    </td>

                    <td className="py-5 text-zinc-300">
                      {totalQty}
                    </td>

                    <td className="py-5">
                      {product.featured ? (
                        <span className="text-amber-300 text-sm">
                          Homepage
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-sm">
                          No
                        </span>
                      )}
                    </td>

                    <td className="py-5">
                      {product.active ? (
                        <span className="text-green-400 text-sm">
                          Active
                        </span>
                      ) : (
                        <span className="text-red-400 text-sm">
                          Hidden
                        </span>
                      )}
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`/products/${product.slug}`}
                          target="_blank"
                          className="text-blue-300 hover:text-white text-sm"
                        >
                          View
                        </Link>

                        <Link
                          href={`/dashboard/admin/products/${product.id}`}
                          className="text-jungle-300 hover:text-white text-sm"
                        >
                          Edit
                        </Link>

                        <button
                          onClick={() => deleteProduct(product.id)}
                          className="text-red-400 hover:text-red-300 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
