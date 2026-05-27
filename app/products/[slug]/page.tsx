export const dynamic = "force-dynamic";
import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

export const dynamic = "force-dynamic";

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

  const productImage = product.images[0] || null;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-bark-800 border border-jungle-900/60">
              {productImage ? (
                <Image
                  src={productImage}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-jungle-700">
                  <span className="text-7xl">
                    {CATEGORY_ICONS[product.category] || "🌿"}
                  </span>
                  <p className="text-sm">Image coming soon</p>
                </div>
              )}
            </div>

            {product.images.length > 1 && (
              <div className="grid grid-cols-4 gap-4 mt-4">
                {product.images.slice(1).map((img, i) => (
                  <div
                    key={i}
                    className="relative aspect-square rounded-2xl overflow-hidden border border-jungle-900/60"
                  >
                    <Image
                      src={img}
                      alt={`${product.name} ${i + 2}`}
                      fill
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">
                {CATEGORY_ICONS[product.category] || "🌿"}
              </span>

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
                    <div className="flex flex-col md:flex-row gap-5">
                      <div className="relative w-full md:w-28 h-28 rounded-2xl overflow-hidden bg-black/30 border border-jungle-900/60 shrink-0">
                        {variantImage ? (
                          <Image
                            src={variantImage}
                            alt={`${product.name} ${variant.label}`}
                            fill
                            className="object-cover"
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-3xl">
                            🌿
                          </div>
                        )}
                      </div>

                      <div className="flex-1">
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

                        <div className="mt-5">
                          <AddToCartButton
                            productId={product.id}
                            variantId={variant.id}
                            name={product.name}
                            variantLabel={variant.label}
                            price={variant.price}
                            image={variantImage}
                            disabled={!variant.inStock || variant.qty <= 0}
                          />
                        </div>
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
