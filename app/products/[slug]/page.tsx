export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

export default async function ProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await db.product.findUnique({
    where: { slug },
    include: {
      variants: {
        orderBy: { price: "asc" },
      },
    },
  });

  if (!product || !product.active) return notFound();

  const fallbackIcon = CATEGORY_ICONS[product.category] || "🌿";

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14">
          <ProductImageGallery
            images={product.images || []}
            name={product.name}
            fallbackIcon={fallbackIcon}
          />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{fallbackIcon}</span>

              <span className="text-sm uppercase tracking-[0.2em] text-jungle-300">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>
            </div>

            <h1 className="font-display text-5xl leading-tight mb-6">
              {product.name}
            </h1>

            {product.subcategory && (
              <p className="mb-5 inline-flex rounded-full border border-jungle-700 bg-jungle-950 px-4 py-2 text-sm text-jungle-300">
                {product.subcategory}
              </p>
            )}

            {product.description && (
              <p className="text-zinc-300 leading-relaxed text-lg mb-8">
                {product.description}
              </p>
            )}

            <div className="space-y-4">
              {product.variants.map((variant) => {
                const variantImage =
                  variant.images?.[0] || product.images?.[0] || null;

                return (
                  <div
                    key={variant.id}
                    className="glass rounded-2xl p-5 border border-jungle-900/60"
                  >
                    <div>
                      <h3 className="font-semibold text-lg">
                        {variant.label}
                      </h3>

                      <div className="flex items-center gap-3 mt-1">
                        <p
                          className="text-2xl font-bold"
                          style={{ color: "#c89f4f" }}
                        >
                          {formatPrice(variant.price)}
                        </p>

                        {variant.compareAt && (
                          <p className="text-zinc-500 line-through">
                            {formatPrice(variant.compareAt)}
                          </p>
                        )}
                      </div>

                      <div className="mt-2 text-sm">
                        {variant.inStock && variant.qty > 0 ? (
                          <span className="text-green-400">
                            ✓ In stock · {variant.qty} available
                          </span>
                        ) : (
                          <span className="text-red-400">Out of stock</span>
                        )}
                      </div>

                      <div className="mt-5 grid sm:grid-cols-2 gap-3">
                        <AddToCartButton
                          productId={product.id}
                          variantId={variant.id}
                          name={product.name}
                          variantLabel={variant.label}
                          price={variant.price}
                          image={variantImage}
                          disabled={!variant.inStock || variant.qty <= 0}
                        />

                        <form action="/api/checkout" method="POST">
                          <button
                            type="button"
                            disabled={!variant.inStock || variant.qty <= 0}
                            onClick={async () => {
                              const res = await fetch("/api/checkout", {
                                method: "POST",
                                headers: {
                                  "Content-Type": "application/json",
                                },
                                body: JSON.stringify({
                                  variantId: variant.id,
                                }),
                              });

                              const data = await res.json();

                              if (data.url) {
                                window.location.href = data.url;
                              } else {
                                alert(data.error || "Checkout failed.");
                              }
                            }}
                            className="w-full rounded-xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 py-3.5 font-semibold transition disabled:opacity-50"
                          >
                            Buy Now
                          </button>
                        </form>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 glass rounded-2xl p-6 border border-jungle-900/60">
              <h3 className="font-semibold mb-4 text-jungle-300">
                Product Information
              </h3>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>• Ethically sourced from trusted communities</p>
                <p>• Carefully handled for freshness and quality</p>
                <p>• Store in a cool dry place</p>
                <p>• Consult your healthcare provider before use</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
