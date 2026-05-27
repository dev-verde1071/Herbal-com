
export const dynamic = "force-dynamic";import { Suspense } from "react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";
import ProductSidebar from "@/components/ProductSidebar";

type SP = { category?: string; min?: string; max?: string; sort?: string; stock?: string };

async function getProducts(params: SP) {
  try {
    const where: any = { active: true, type: { in: ["RETAIL", "BOTH"] } };
    if (params.category) where.category = params.category;
    if (params.stock === "instock") where.variants = { some: { inStock: true } };

    let products = await db.product.findMany({
      where,
      include: { variants: { orderBy: { price: "asc" } } },
    });

    if (params.min || params.max) {
      const min = Number(params.min) || 0;
      const max = Number(params.max) || 500;
      products = products.filter((p) =>
        p.variants.some((v) => v.price >= min && v.price <= max)
      );
    }

    if (params.sort === "az")         products.sort((a, b) => a.name.localeCompare(b.name));
    else if (params.sort === "za")    products.sort((a, b) => b.name.localeCompare(a.name));
    else if (params.sort === "price-asc")
      products.sort((a, b) => Math.min(...a.variants.map((v) => v.price)) - Math.min(...b.variants.map((v) => v.price)));
    else if (params.sort === "price-desc")
      products.sort((a, b) => Math.min(...b.variants.map((v) => v.price)) - Math.min(...a.variants.map((v) => v.price)));

    return products;
  } catch { return []; }
}

export default async function ProductsPage({ searchParams }: { searchParams: Promise<SP> }) {
  const params   = await searchParams;
  const products = await getProducts(params);

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="text-jungle-400 text-sm font-semibold uppercase tracking-widest mb-2">Herbal Communities</p>
          <h1 className="text-5xl font-bold text-white font-display">
            {params.category ? params.category.charAt(0).toUpperCase() + params.category.slice(1) : "All Products"}
          </h1>
          <p className="text-gray-500 mt-2 text-sm">{products.length} product{products.length !== 1 ? "s" : ""} found</p>
        </div>

        <div className="flex gap-8">
          <Suspense fallback={null}>
            <ProductSidebar />
          </Suspense>

          <div className="flex-1 min-w-0">
            {products.length === 0 ? (
              <div className="glass rounded-2xl p-16 text-center">
                <span className="text-5xl mb-4 block">🌿</span>
                <p className="text-gray-400 text-lg">No products found.</p>
                <a href="/products" className="inline-block mt-4 text-jungle-300 hover:text-white transition text-sm font-semibold">
                  Clear filters →
                </a>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
