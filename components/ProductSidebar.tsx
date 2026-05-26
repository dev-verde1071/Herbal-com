"use client";
import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { SlidersHorizontal, X } from "lucide-react";
import { PRODUCT_CATEGORIES } from "@/lib/utils";

export default function ProductSidebar() {
  const router = useRouter();
  const params = useSearchParams();
  const [category, setCategory] = useState(params.get("category") || "");
  const [minPrice, setMinPrice]   = useState(Number(params.get("min")) || 0);
  const [maxPrice, setMaxPrice]   = useState(Number(params.get("max")) || 500);
  const [sort, setSort]           = useState(params.get("sort") || "");
  const [stock, setStock]         = useState(params.get("stock") || "");
  const [mobileOpen, setMobileOpen] = useState(false);

  function apply() {
    const q = new URLSearchParams();
    if (category)    q.set("category", category);
    if (minPrice > 0) q.set("min", String(minPrice));
    if (maxPrice < 500) q.set("max", String(maxPrice));
    if (sort)  q.set("sort", sort);
    if (stock) q.set("stock", stock);
    router.push(`/products?${q.toString()}`);
    setMobileOpen(false);
  }

  function clear() {
    setCategory(""); setMinPrice(0); setMaxPrice(500); setSort(""); setStock("");
    router.push("/products");
    setMobileOpen(false);
  }

  const hasFilters = !!(category || minPrice > 0 || maxPrice < 500 || sort || stock);

  const body = (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-4 h-4 text-jungle-400" />
          <h3 className="font-semibold text-white">Filters</h3>
        </div>
        {hasFilters && (
          <button onClick={clear} className="text-xs text-terra-300 hover:text-terra-200 flex items-center gap-1">
            <X className="w-3 h-3" /> Clear all
          </button>
        )}
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Category</h4>
        <div className="flex flex-col gap-1">
          {[{ value: "", label: "All Products" }, ...PRODUCT_CATEGORIES].map((c) => (
            <button key={c.value} onClick={() => setCategory(c.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${category === c.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {c.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Price Range</h4>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between text-sm text-gray-300">
            <span>${minPrice}</span>
            <span>${maxPrice}{maxPrice === 500 ? "+" : ""}</span>
          </div>
          <input type="range" min={0} max={500} step={5} value={minPrice}
            onChange={(e) => setMinPrice(Number(e.target.value))} />
          <input type="range" min={0} max={500} step={5} value={maxPrice}
            onChange={(e) => setMaxPrice(Number(e.target.value))} />
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Sort By</h4>
        <div className="flex flex-col gap-1">
          {[
            { value: "",           label: "Default"            },
            { value: "az",         label: "A → Z"              },
            { value: "za",         label: "Z → A"              },
            { value: "price-asc",  label: "Price: Low to High" },
            { value: "price-desc", label: "Price: High to Low" },
          ].map((s) => (
            <button key={s.value} onClick={() => setSort(s.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${sort === s.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <div>
        <h4 className="text-xs font-semibold uppercase tracking-widest text-gray-500 mb-3">Availability</h4>
        <div className="flex flex-col gap-1">
          {[{ value: "", label: "All" }, { value: "instock", label: "In Stock Only" }].map((s) => (
            <button key={s.value} onClick={() => setStock(s.value)}
              className={`text-left text-sm px-3 py-2 rounded-lg transition ${stock === s.value ? "bg-jungle-700 text-white font-medium" : "text-gray-400 hover:bg-jungle-900/50 hover:text-white"}`}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={apply}
        className="w-full bg-jungle-600 hover:bg-jungle-500 text-white font-semibold py-3 rounded-xl transition">
        Apply Filters
      </button>
    </div>
  );

  return (
    <>
      <div className="lg:hidden mb-4">
        <button onClick={() => setMobileOpen(!mobileOpen)}
          className="flex items-center gap-2 text-sm font-semibold bg-jungle-900/60 border border-jungle-700/40 text-jungle-300 px-4 py-2.5 rounded-xl">
          <SlidersHorizontal className="w-4 h-4" />
          Filters {hasFilters && <span className="bg-jungle-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center">•</span>}
        </button>
        {mobileOpen && (
          <div className="mt-4 p-5 bg-bark-800/80 border border-jungle-900/60 rounded-2xl">{body}</div>
        )}
      </div>

      <aside className="hidden lg:block w-60 shrink-0 p-5 bg-bark-800/40 border border-jungle-900/60 rounded-2xl h-fit sticky top-24">
        {body}
      </aside>
    </>
  );
}
