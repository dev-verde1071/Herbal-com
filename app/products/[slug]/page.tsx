import { notFound } from "next/navigation";
import Image from "next/image";
import { db } from "@/lib/db";
import CheckoutButton from "@/components/CheckoutButton";
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

  const image = product.images[0] || null;

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-14">
          <div>
            <div className="relative aspect-square rounded-3xl overflow-hidden bg-bark-800 border border-jungle-900/60">
              {image ? (
                <Image
                  src={image}
                  alt={product.name}
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-jungle-700">
                  <span className="text-7xl">
                    {CATEGORY_ICONS[product.category] || "🌿"}
                  </span>

                  <p className="text-sm">
                    Image coming soon
                  </p>
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

            {product.description && (
              <p className="text-zinc-300 leading-relaxed text-lg mb-8">
                {product.description}
              </p>
            )}

            <div className="space-y-4">
              {product.variants.map((variant) => (
                <div
                  key={variant.id}
                  className="glass rounded-2xl p-5 border border-jungle-900/60"
                >
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {variant.label}
                      </h3>

                      <p
                        className="text-2xl font-bold mt-1"
                        style={{ color: "#c89f4f" }}
                      >
                        {formatPrice(variant.price)}
                      </p>

                      <div className="mt-2 text-sm">
                        {variant.inStock ? (
                          <span className="text-green-400">
                            ✓ In stock
                          </span>
                        ) : (
                          <span className="text-red-400">
                            Out of stock
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-full md:w-56">
                      <CheckoutButton
                        variantId={variant.id}
                        disabled={!variant.inStock}
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-10 glass rounded-2xl p-6 border border-jungle-900/60">
              <h3 className="font-semibold mb-4 text-jungle-300">
                Product Information
              </h3>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>
                  • Ethically sourced from trusted communities
                </p>

                <p>
                  • Carefully handled for freshness and quality
                </p>

                <p>
                  • Store in a cool dry place
                </p>

                <p>
                  • Consult your healthcare provider before use
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
