export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import AddToCartButton from "@/components/AddToCartButton";
import BuyNowButton from "@/components/BuyNowButton";
import ProductImageGallery from "@/components/ProductImageGallery";
import CartUrgencyNote from "@/components/CartUrgencyNote";
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

export default async function WholesaleProductPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    redirect("/wholesale");
  }

  const application = await db.wholesaleApplication.findFirst({
    where: {
      OR: [{ userId }, { email }],
      status: "APPROVED",
      archived: false,
    },
  });

  if (!application) {
    redirect("/dashboard/wholesale");
  }

  const { slug } = await params;

  const product = await db.product.findFirst({
    where: {
      slug,
      active: true,
      type: "WHOLESALE",
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!product) return notFound();

  const fallbackIcon = CATEGORY_ICONS[product.category] || "🌿";

  const allImages = [
    ...(product.images || []),
    ...product.variants.flatMap((variant) => variant.images || []),
  ].filter(Boolean);

  const uniqueImages = Array.from(new Set(allImages));

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <a
            href="/dashboard/wholesale"
            className="text-sm text-jungle-300 hover:text-white transition"
          >
            ← Back to Wholesale Products
          </a>
        </div>

        <div className="grid lg:grid-cols-2 gap-14">
          <ProductImageGallery
            images={uniqueImages}
            name={product.name}
            fallbackIcon={fallbackIcon}
          />

          <div>
            <div className="flex items-center gap-2 mb-4">
              <span className="text-2xl">{fallbackIcon}</span>

              <span className="text-sm uppercase tracking-[0.2em] text-jungle-300">
                {CATEGORY_LABELS[product.category] || product.category}
              </span>

              <span className="text-xs rounded-full bg-blue-900/50 border border-blue-700/40 text-blue-300 px-3 py-1">
                WHOLESALE
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

                const unavailable = !variant.inStock || variant.qty <= 0;

                return (
                  <div
                    key={variant.id}
                    className="glass rounded-2xl p-5 border border-jungle-900/60"
                  >
                    <div className="flex gap-4">
                      {variantImage && (
                        <img
                          src={variantImage}
                          alt={`${product.name} ${variant.label}`}
                          className="w-24 h-24 rounded-2xl object-cover border border-jungle-900/60 bg-black/30"
                        />
                      )}

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
                          {!unavailable ? (
                            <span className="text-green-400">
                              ✓ Wholesale stock · {variant.qty} available
                            </span>
                          ) : (
                            <span className="text-red-400">Out of stock</span>
                          )}

                          <CartUrgencyNote variantId={variant.id} />
                        </div>
                      </div>
                    </div>

                    <div className="mt-5 grid sm:grid-cols-2 gap-3">
                      <AddToCartButton
                        productId={product.id}
                        variantId={variant.id}
                        name={product.name}
                        variantLabel={variant.label}
                        price={variant.price}
                        image={variantImage}
                        disabled={unavailable}
                      />

                      <BuyNowButton
                        variantId={variant.id}
                        disabled={unavailable}
                      />
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="mt-10 glass rounded-2xl p-6 border border-jungle-900/60">
              <h3 className="font-semibold mb-4 text-jungle-300">
                Wholesale Product Notes
              </h3>

              <div className="space-y-3 text-sm text-zinc-400">
                <p>• Wholesale orders may require team confirmation.</p>
                <p>• Availability can change based on harvest and inventory.</p>
                <p>• Shipping and tracking will be sent after fulfillment.</p>
                <p>• A Herbal Communities team member may contact you for large orders.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
