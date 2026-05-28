"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
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
  subcategory?: string | null;
  active: boolean;
  featured: boolean;
  type: string;
  variants: Variant[];
  createdAt?: string | Date;
};

type Props = {
  products: Product[];
  productType?: "RETAIL" | "WHOLESALE";
};

export default function AdminProductList({
  products,
  productType = "RETAIL",
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<
    "ALL" | "ACTIVE" | "HIDDEN" | "FEATURED" | "OUT_OF_STOCK"
  >("ALL");

  const basePath =
    productType === "WHOLESALE"
      ? "/dashboard/admin/wholesale-products"
      : "/dashboard/admin/products";

  const publicBasePath =
    productType === "WHOLESALE" ? "/dashboard/wholesale" : "/products";

  const filteredProducts = useMemo(() => {
    const q = search.toLowerCase().trim();

    return products.filter((product) => {
      const totalQty = product.variants.reduce(
        (sum, variant) => sum + Number(variant.qty || 0),
        0
      );

      const anyInStock = product.variants.some(
        (variant) => variant.inStock && Number(variant.qty || 0) > 0
      );

      let matchesFilter = true;

      if (filter === "ACTIVE") matchesFilter = product.active;
      if (filter === "HIDDEN") matchesFilter = !product.active;
      if (filter === "FEATURED") matchesFilter = product.featured;
      if (filter === "OUT_OF_STOCK") matchesFilter = !anyInStock || totalQty <= 0;

      const searchableText = [
        product.name,
        product.slug,
        product.category,
        product.subcategory,
        product.type,
        product.variants.map((variant) => variant.label).join(" "),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [products, search, filter]);

  async function deleteProduct(id: string) {
    if (!confirm("Delete this product permanently?")) return;

    const res = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (!res.ok) {
      alert("Failed to delete product.");
      return;
    }

    router.refresh();
  }

  const counts = {
    ALL: products.length,
    ACTIVE: products.filter((p) => p.active).length,
    HIDDEN: products.filter((p) => !p.active).length,
    FEATURED: products.filter((p) => p.featured).length,
    OUT_OF_STOCK: products.filter((p) => {
      const totalQty = p.variants.reduce(
        (sum, variant) => sum + Number(variant.qty || 0),
        0
      );

      const anyInStock = p.variants.some(
        (variant) => variant.inStock && Number(variant.qty || 0) > 0
      );

      return !anyInStock || totalQty <= 0;
    }).length,
  };

  const filters = [
    "ALL",
    "ACTIVE",
    "FEATURED",
    "OUT_OF_STOCK",
    "HIDDEN",
  ] as const;

  function filterLabel(value: string) {
    if (value === "OUT_OF_STOCK") return "Out of Stock";
    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products by name, category, subcategory, slug, or variant..."
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />

          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                filter === status
                  ? "bg-jungle-700 border-jungle-400 text-white"
                  : "bg-black/20 border-jungle-900/60 text-zinc-300 hover:bg-jungle-900/60"
              }`}
            >
              {filterLabel(status)}{" "}
              <span className="text-xs opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>

        <p className="text-zinc-500 text-sm mt-4">
          Showing {filteredProducts.length} of {products.length} products.
        </p>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No products found.
        </div>
      ) : (
        <div className="glass rounded-3xl p-8 border border-jungle-900/60 overflow-x-auto">
          <table className="w-full min-w-[1000px]">
            <thead>
              <tr className="border-b border-jungle-900/60 text-left text-sm text-zinc-400">
                <th className="pb-4">Product</th>
                <th className="pb-4">Category</th>
                <th className="pb-4">Variants</th>
                <th className="pb-4">Qty</th>
                <th className="pb-4">Featured</th>
                <th className="pb-4">Status</th>
                <th className="pb-4">Actions</th>
              </tr>
            </thead>

            <tbody>
              {filteredProducts.map((product) => {
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
                      <p className="font-semibold text-white">{product.name}</p>
                      <p className="text-xs text-zinc-500 mt-1">
                        /products/{product.slug}
                      </p>
                    </td>

                    <td className="py-5 text-zinc-300">
                      <p>{product.category}</p>
                      {product.subcategory && (
                        <p className="text-xs text-zinc-500 mt-1">
                          {product.subcategory}
                        </p>
                      )}
                    </td>

                    <td className="py-5 text-zinc-300">
                      {product.variants.length}
                    </td>

                    <td className="py-5 text-zinc-300">{totalQty}</td>

                    <td className="py-5">
                      {product.featured ? (
                        <span className="text-amber-300 text-sm">
                          Homepage
                        </span>
                      ) : (
                        <span className="text-zinc-500 text-sm">No</span>
                      )}
                    </td>

                    <td className="py-5">
                      {product.active ? (
                        <span className="text-green-400 text-sm">Active</span>
                      ) : (
                        <span className="text-red-400 text-sm">Hidden</span>
                      )}
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`${publicBasePath}/${product.slug}`}
                          target="_blank"
                          className="text-blue-300 hover:text-white text-sm"
                        >
                          View
                        </Link>

                        <Link
                          href={`${basePath}/${product.id}`}
                          className="text-jungle-300 hover:text-white text-sm"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
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
