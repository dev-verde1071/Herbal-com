import Link from "next/link";
import { CATEGORY_ICONS, CATEGORY_LABELS, formatPrice } from "@/lib/utils";

type Variant = {
  id: string;
  label: string;
  price: number;
  compareAt?: number | null;
  qty: number;
  inStock: boolean;
  images?: string[];
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  subcategory?: string | null;
  type?: "RETAIL" | "WHOLESALE" | "BOTH" | string;
  images?: string[];
  active: boolean;
  featured?: boolean;
  variants: Variant[];
};

type ProductCardProps = {
  product: Product;
  hrefOverride?: string;
  showFeaturedBadge?: boolean;
};

function isValidImageUrl(image?: string | null) {
  return Boolean(
    image &&
      typeof image === "string" &&
      image.trim().length > 0 &&
      !image.startsWith("data:")
  );
}

export default function ProductCard({
  product,
  hrefOverride,
  showFeaturedBadge = true,
}: ProductCardProps) {
  const firstVariant = product.variants?.[0];

  const productImages = (product.images || []).filter(isValidImageUrl);

  const variantImages = (product.variants || [])
    .flatMap((variant) => variant.images || [])
    .filter(isValidImageUrl);

  const productImage = productImages[0] || variantImages[0] || null;

  const isWholesale = product.type === "WHOLESALE";

  const defaultHref = isWholesale
    ? `/dashboard/wholesale/products/${product.slug}`
    : `/products/${product.slug}`;

  const href = hrefOverride || defaultHref;

  const categoryLabel =
    CATEGORY_LABELS[product.category] || product.category;

  const categoryIcon =
    CATEGORY_ICONS[product.category] || "🌿";

  const totalQty =
    product.variants?.reduce(
      (sum, variant) => sum + Number(variant.qty || 0),
      0
    ) || 0;

  const inStock =
    product.variants?.some(
      (variant) =>
        variant.inStock && Number(variant.qty || 0) > 0
    ) || false;

  return (
    <Link
      href={href}
      className="group glass block overflow-hidden rounded-3xl border border-jungle-900/60 transition hover:border-jungle-500/70"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-black/30">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover transition duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-6xl text-jungle-600">
            {categoryIcon}
          </div>
        )}

        <div className="absolute left-4 top-4 flex flex-wrap gap-2">
          <span className="rounded-full border border-jungle-700/60 bg-black/70 px-3 py-1 text-xs text-jungle-200">
            {categoryLabel}
          </span>

          {isWholesale && (
            <span className="rounded-full border border-blue-600/60 bg-blue-900/80 px-3 py-1 text-xs text-blue-200">
              Wholesale
            </span>
          )}

          {product.featured && showFeaturedBadge && (
            <span className="rounded-full border border-amber-600/60 bg-amber-900/80 px-3 py-1 text-xs text-amber-200">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {product.subcategory && (
          <p className="mb-2 text-xs uppercase tracking-[0.2em] text-jungle-400">
            {product.subcategory}
          </p>
        )}

        <h3 className="mb-3 font-display text-2xl transition group-hover:text-jungle-300">
          {product.name}
        </h3>

        {product.description && (
          <p className="mb-5 line-clamp-2 text-sm leading-relaxed text-zinc-400">
            {product.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            {firstVariant ? (
              <>
                <p className="mb-1 text-xs text-zinc-500">
                  Starting at
                </p>

                <p
                  className="text-xl font-bold"
                  style={{ color: "#c89f4f" }}
                >
                  {formatPrice(firstVariant.price)}
                </p>
              </>
            ) : (
              <p className="text-sm text-zinc-500">
                Pricing coming soon
              </p>
            )}
          </div>

          <div className="text-right">
            {inStock ? (
              <p className="text-xs text-green-400">
                {totalQty} available
              </p>
            ) : (
              <p className="text-xs text-red-400">
                Out of stock
              </p>
            )}

            <p className="mt-1 text-xs text-zinc-500">
              {product.variants?.length || 0} option
              {product.variants?.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
