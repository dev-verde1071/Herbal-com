"use client";

import { useEffect, useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Loader2, SlidersHorizontal, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

type FilterState = {
  category: string;
  minPrice: number;
  maxPrice: number;
  sort: string;
  stock: string;
};

export default function ProductSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const [isPending, startTransition] = useTransition();

  const currentQueryString = params.toString();

  const [category, setCategory] = useState(params.get("category") || "");
  const [minPrice, setMinPrice] = useState(Number(params.get("min")) || 0);
  const [maxPrice, setMaxPrice] = useState(Number(params.get("max")) || 500);
  const [sort, setSort] = useState(params.get("sort") || "");
  const [stock, setStock] = useState(params.get("stock") || "");
  const [mobileOpen, setMobileOpen] = useState(false);
  const [manualLoading, setManualLoading] = useState(false);

  const isLoading = isPending || manualLoading;

  useEffect(() => {
    setCategory(params.get("category") || "");
    setMinPrice(Number(params.get("min")) || 0);
    setMaxPrice(Number(params.get("max")) || 500);
    setSort(params.get("sort") || "");
    setStock(params.get("stock") || "");
    setManualLoading(false);
  }, [currentQueryString, params]);

  function buildProductUrl(filters: FilterState) {
    const q = new URLSearchParams();

    if (filters.category) q.set("category", filters.category);
    if (filters.minPrice > 0) q.set("min", String(filters.minPrice));
    if (filters.maxPrice < 500) q.set("max", String(filters.maxPrice));
    if (filters.sort) q.set("sort", filters.sort);
    if (filters.stock) q.set("stock", filters.stock);

    const queryString = q.toString();

    return queryString ? `/products?${queryString}` : "/products";
  }

  function getCurrentProductsUrl() {
    return currentQueryString ? `/products?${currentQueryString}` : "/products";
  }

  function apply() {
    const nextFilters: FilterState = {
      category,
      minPrice,
      maxPrice,
      sort,
      stock,
    };

    const targetUrl = buildProductUrl(nextFilters);
    const currentUrl = getCurrentProductsUrl();

    setManualLoading(true);

    startTransition(() => {
      router.push(targetUrl);
      router.refresh();
    });

    if (targetUrl === currentUrl) {
      window.setTimeout(() => {
        setManualLoading(false);
      }, 700);
    }

    setMobileOpen(false);
  }

  function clear() {
    setCategory("");
    setMinPrice(0);
    setMaxPrice(500);
    setSort("");
    setStock("");
    setManualLoading(true);

    startTransition(() => {
      router.push("/products");
      router.refresh();
    });

    if (getCurrentProductsUrl() === "/products") {
      window.setTimeout(() => {
        setManualLoading(false);
      }, 700);
    }

    setMobileOpen(false);
  }

  const hasFilters = !!(
    category ||
    minPrice > 0 ||
    maxPrice < 500 ||
    sort ||
    stock
  );

  const body = (
    <div className="relative flex flex-col gap-6">
      {isLoading && (
        <div className="absolute inset-0 z-20 flex items-center justify-center rounded-2xl bg-black/50 backdrop-blur-sm">
          <div className="flex items-center gap-2 rounded-full border border-jungle-700/60 bg-bark-900 px-4 py-2 text-sm text-jungle-200">
            <Loader2 className="h-4 w-4 animate-spin" />
            Loading products...
          </div>
        </div>
      )}

      <div className={isLoading ? "pointer-events-none opacity-60" : ""}>
        <div className="flex flex-col gap-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <SlidersHorizontal className="w-4 h-4 text-jungle-400" />
              <h3 className="font-semibold text-white">Filters</h3>
            </div>

            {hasFilters && (
              <button
                type="button"
                onClick={clear}
                disabled={isLoading}
                className="text-xs text-terra-300 hover:text-terra-200 flex items-center gap-1 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                <X className="w-3 h-3" /> Clear all
              </button>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Category
            </h4>

            <div className="flex flex-col gap-1">
              {[{ value: "", label: "All Products" }, ...PRODUCT_CATEGORIES].map(
                (c) => (
                  <button
                    key={c.value}
                    type="button"
                    onClick={() => setCategory(c.value)}
                    disabled={isLoading}
                    className={`text-left text-sm px-3 py-2 rounded-lg transition disabled:cursor-not-allowed ${
                      category === c.value
                        ? "bg-jungle-700 text-white font-medium"
                        : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"
                    }`}
                  >
                    {c.label}
                  </button>
                )
              )}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Price Range
            </h4>

            <div className="flex flex-col gap-3">
              <div className="flex items-center justify-between text-sm text-gray-300">
                <span>${minPrice}</span>
                <span>
                  ${maxPrice}
                  {maxPrice === 500 ? "+" : ""}
                </span>
              </div>

              <input
                type="range"
                min={0}
                max={500}
                step={5}
                value={minPrice}
                disabled={isLoading}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMinPrice(Math.min(value, maxPrice));
                }}
              />

              <input
                type="range"
                min={0}
                max={500}
                step={5}
                value={maxPrice}
                disabled={isLoading}
                onChange={(e) => {
                  const value = Number(e.target.value);
                  setMaxPrice(Math.max(value, minPrice));
                }}
              />

              <p className="text-xs text-zinc-500">
                Adjust price, then click Apply Filters.
              </p>
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Sort By
            </h4>

            <div className="flex flex-col gap-1">
              {[
                { value: "", label: "Default" },
                { value: "az", label: "A → Z" },
                { value: "za", label: "Z → A" },
                { value: "price-asc", label: "Price: Low to High" },
                { value: "price-desc", label: "Price: High to Low" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setSort(s.value)}
                  disabled={isLoading}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition disabled:cursor-not-allowed ${
                    sort === s.value
                      ? "bg-jungle-700 text-white font-medium"
                      : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">
              Availability
            </h4>

            <div className="flex flex-col gap-1">
              {[
                { value: "", label: "All" },
                { value: "instock", label: "In Stock Only" },
              ].map((s) => (
                <button
                  key={s.value}
                  type="button"
                  onClick={() => setStock(s.value)}
                  disabled={isLoading}
                  className={`text-left text-sm px-3 py-2 rounded-lg transition disabled:cursor-not-allowed ${
                    stock === s.value
                      ? "bg-jungle-700 text-white font-medium"
                      : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          <button
            type="button"
            onClick={apply}
            disabled={isLoading}
            className="w-full bg-jungle-600 hover:bg-jungle-500 disabled:opacity-70 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-xl transition flex items-center justify-center gap-2"
          >
            {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
            {isLoading ? "Loading..." : "Apply Filters"}
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button
          type="button"
          onClick={() => setMobileOpen(!mobileOpen)}
          disabled={isLoading}
          className="flex items-center gap-2 text-sm font-semibold bg-jungle-900/60 border border-jungle-700/40 text-jungle-300 px-4 py-2.5 rounded-xl disabled:opacity-70 disabled:cursor-not-allowed"
        >
          <SlidersHorizontal className="w-4 h-4" />
          Filters
          {hasFilters && (
            <span className="bg-jungle-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">
              •
            </span>
          )}
        </button>

        {mobileOpen && (
          <div className="mt-4 p-5 bg-bark-800/80 border border-jungle-900/60 rounded-2xl">
            {body}
          </div>
        )}
      </div>

      <aside className="hidden lg:block w-60 shrink-0 p-5 bg-bark-800/40 border border-jungle-900/60 rounded-2xl h-fit sticky top-24">
        {body}
      </aside>
    </>
  );
}
