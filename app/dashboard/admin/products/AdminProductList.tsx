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

type ProductFilter =
  | "ALL"
  | "ACTIVE"
  | "HIDDEN"
  | "FEATURED"
  | "OUT_OF_STOCK";

const MAX_WHOLESALE_FEATURED_PRODUCTS = 6;

export default function AdminProductList({
  products,
  productType = "RETAIL",
}: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<ProductFilter>("ALL");
  const [updatingFeaturedId, setUpdatingFeaturedId] = useState<string | null>(
    null
  );

  const basePath =
    productType === "WHOLESALE"
      ? "/dashboard/admin/wholesale-products"
      : "/dashboard/admin/products";

  const publicBasePath =
    productType === "WHOLESALE" ? "/dashboard/wholesale" : "/products";

  const featuredCount = products.filter((product) => product.featured).length;

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

      if (filter === "ACTIVE") {
        matchesFilter = product.active;
      }

      if (filter === "HIDDEN") {
        matchesFilter = !product.active;
      }

      if (filter === "FEATURED") {
        matchesFilter = product.featured;
      }

      if (filter === "OUT_OF_STOCK") {
        matchesFilter = !anyInStock || totalQty <= 0;
      }

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
    if (!confirm("Delete this product permanently?")) {
      return;
    }

    const response = await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      alert("Failed to delete product.");
      return;
    }

    router.refresh();
  }

  async function toggleFeatured(product: Product) {
    const willBeFeatured = !product.featured;

    if (
      productType === "WHOLESALE" &&
      willBeFeatured &&
      featuredCount >= MAX_WHOLESALE_FEATURED_PRODUCTS
    ) {
      alert(
        `Only ${MAX_WHOLESALE_FEATURED_PRODUCTS} wholesale products can be featured at one time. Unfeature another wholesale product first.`
      );
      return;
    }

    setUpdatingFeaturedId(product.id);

    try {
      const response = await fetch(`/api/admin/products/${product.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          featured: willBeFeatured,
        }),
      });

      const data = await response.json().catch(() => null);

      if (!response.ok) {
        alert(data?.error || "Failed to update featured status.");
        return;
      }

      router.refresh();
    } catch (error) {
      console.error("Failed to update featured status:", error);
      alert("Failed to update featured status.");
    } finally {
      setUpdatingFeaturedId(null);
    }
  }

  const counts = {
    ALL: products.length,
    ACTIVE: products.filter((product) => product.active).length,
    HIDDEN: products.filter((product) => !product.active).length,
    FEATURED: products.filter((product) => product.featured).length,
    OUT_OF_STOCK: products.filter((product) => {
      const totalQty = product.variants.reduce(
        (sum, variant) => sum + Number(variant.qty || 0),
        0
      );

      const anyInStock = product.variants.some(
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

  function filterLabel(value: ProductFilter) {
    if (value === "OUT_OF_STOCK") {
      return "Out of Stock";
    }

    return value.charAt(0) + value.slice(1).toLowerCase();
  }

  function featuredLocationLabel() {
    return productType === "WHOLESALE"
      ? "Wholesale page"
      : "Homepage";
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl border border-jungle-900/60 p-6">
        <div className="grid items-center gap-4 lg:grid-cols-[1fr_auto]">
          <input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search products by name, category, subcategory, slug, or variant..."
            className="w-full rounded-2xl border border-jungle-900/60 bg-black/20 px-4 py-3 outline-none focus:border-jungle-500"
          />

          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-2xl border border-jungle-900/60 bg-black/30 px-6 py-3 font-semibold transition hover:bg-jungle-900/60"
          >
            Refresh
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-3">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl border px-4 py-2 text-sm font-semibold transition ${
                filter === status
                  ? "border-jungle-400 bg-jungle-700 text-white"
                  : "border-jungle-900/60 bg-black/20 text-zinc-300 hover:bg-jungle-900/60"
              }`}
            >
              {filterLabel(status)}{" "}
              <span className="text-xs opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>

        <div className="mt-4 flex flex-col gap-2 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <p>
            Showing {filteredProducts.length} of {products.length} products.
          </p>

          {productType === "WHOLESALE" && (
            <p
              className={
                featuredCount >= MAX_WHOLESALE_FEATURED_PRODUCTS
                  ? "text-amber-300"
                  : "text-jungle-300"
              }
            >
              {featuredCount} of {MAX_WHOLESALE_FEATURED_PRODUCTS} wholesale
              featured slots used
            </p>
          )}
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="glass rounded-3xl border border-jungle-900/60 p-12 text-center text-zinc-400">
          No products found.
        </div>
      ) : (
        <div className="glass overflow-x-auto rounded-3xl border border-jungle-900/60 p-8">
          <table className="w-full min-w-[1100px]">
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

                const isUpdatingFeatured =
                  updatingFeaturedId === product.id;

                const wholesaleFeatureLimitReached =
                  productType === "WHOLESALE" &&
                  !product.featured &&
                  featuredCount >= MAX_WHOLESALE_FEATURED_PRODUCTS;

                return (
                  <tr
                    key={product.id}
                    className="border-b border-jungle-900/40"
                  >
                    <td className="py-5">
                      <p className="font-semibold text-white">{product.name}</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        {productType === "WHOLESALE"
                          ? `/dashboard/wholesale/${product.slug}`
                          : `/products/${product.slug}`}
                      </p>
                    </td>

                    <td className="py-5 text-zinc-300">
                      <p>{product.category}</p>

                      {product.subcategory && (
                        <p className="mt-1 text-xs text-zinc-500">
                          {product.subcategory}
                        </p>
                      )}
                    </td>

                    <td className="py-5 text-zinc-300">
                      {product.variants.length}
                    </td>

                    <td className="py-5 text-zinc-300">{totalQty}</td>

                    <td className="py-5">
                      <div className="flex min-w-[150px] flex-col items-start gap-2">
                        {product.featured ? (
                          <span className="text-sm text-amber-300">
                            {featuredLocationLabel()}
                          </span>
                        ) : (
                          <span className="text-sm text-zinc-500">
                            Not featured
                          </span>
                        )}

                        <button
                          type="button"
                          onClick={() => toggleFeatured(product)}
                          disabled={
                            isUpdatingFeatured ||
                            wholesaleFeatureLimitReached
                          }
                          title={
                            wholesaleFeatureLimitReached
                              ? `The wholesale page already has ${MAX_WHOLESALE_FEATURED_PRODUCTS} featured products.`
                              : undefined
                          }
                          className={`rounded-xl border px-3 py-1.5 text-xs font-semibold transition ${
                            product.featured
                              ? "border-amber-700/70 bg-amber-950/30 text-amber-300 hover:bg-amber-900/40"
                              : wholesaleFeatureLimitReached
                                ? "cursor-not-allowed border-zinc-800 bg-zinc-900/40 text-zinc-600"
                                : "border-jungle-700/70 bg-jungle-900/30 text-jungle-300 hover:bg-jungle-800/50"
                          }`}
                        >
                          {isUpdatingFeatured
                            ? "Updating..."
                            : product.featured
                              ? "Unfeature"
                              : "Feature"}
                        </button>
                      </div>
                    </td>

                    <td className="py-5">
                      {product.active ? (
                        <span className="text-sm text-green-400">Active</span>
                      ) : (
                        <span className="text-sm text-red-400">Hidden</span>
                      )}
                    </td>

                    <td className="py-5">
                      <div className="flex items-center gap-3">
                        <Link
                          href={`${publicBasePath}/${product.slug}`}
                          target="_blank"
                          className="text-sm text-blue-300 hover:text-white"
                        >
                          View
                        </Link>

                        <Link
                          href={`${basePath}/${product.id}`}
                          className="text-sm text-jungle-300 hover:text-white"
                        >
                          Edit
                        </Link>

                        <button
                          type="button"
                          onClick={() => deleteProduct(product.id)}
                          className="text-sm text-red-400 hover:text-red-300"
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
