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

function isValidImageUrl(image?: string | null) {
  return Boolean(
    image &&
      typeof image === "string" &&
      image.trim().length > 0 &&
      !image.startsWith("data:")
  );
}

export default function ProductCard({ product }: { product: Product }) {
  const firstVariant = product.variants?.[0];

  const productImages = (product.images || []).filter(isValidImageUrl);

  const variantImages = (product.variants || [])
    .flatMap((variant) => variant.images || [])
    .filter(isValidImageUrl);

  const productImage = productImages[0] || variantImages[0] || null;

  const isWholesale = product.type === "WHOLESALE";

  const href = isWholesale
    ? `/dashboard/wholesale/products/${product.slug}`
    : `/products/${product.slug}`;

  const categoryLabel = CATEGORY_LABELS[product.category] || product.category;
  const categoryIcon = CATEGORY_ICONS[product.category] || "🌿";

  const totalQty =
    product.variants?.reduce(
      (sum, variant) => sum + Number(variant.qty || 0),
      0
    ) || 0;

  const inStock =
    product.variants?.some(
      (variant) => variant.inStock && Number(variant.qty || 0) > 0
    ) || false;

  return (
    <Link
      href={href}
      className="group glass rounded-3xl overflow-hidden border border-jungle-900/60 hover:border-jungle-500/70 transition block"
    >
      <div className="relative aspect-[4/3] bg-black/30 overflow-hidden">
        {productImage ? (
          <img
            src={productImage}
            alt={product.name}
            className="absolute inset-0 h-full w-full object-cover group-hover:scale-105 transition duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-6xl text-jungle-600">
            {categoryIcon}
          </div>
        )}

        <div className="absolute top-4 left-4 flex flex-wrap gap-2">
          <span className="rounded-full bg-black/70 border border-jungle-700/60 px-3 py-1 text-xs text-jungle-200">
            {categoryLabel}
          </span>

          {isWholesale && (
            <span className="rounded-full bg-blue-900/80 border border-blue-600/60 px-3 py-1 text-xs text-blue-200">
              Wholesale
            </span>
          )}

          {product.featured && !isWholesale && (
            <span className="rounded-full bg-amber-900/80 border border-amber-600/60 px-3 py-1 text-xs text-amber-200">
              Featured
            </span>
          )}
        </div>
      </div>

      <div className="p-6">
        {product.subcategory && (
          <p className="text-xs uppercase tracking-[0.2em] text-jungle-400 mb-2">
            {product.subcategory}
          </p>
        )}

        <h3 className="font-display text-2xl mb-3 group-hover:text-jungle-300 transition">
          {product.name}
        </h3>

        {product.description && (
          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2 mb-5">
            {product.description}
          </p>
        )}

        <div className="flex items-end justify-between gap-4">
          <div>
            {firstVariant ? (
              <>
                <p className="text-xs text-zinc-500 mb-1">Starting at</p>

                <p
                  className="font-bold text-xl"
                  style={{ color: "#c89f4f" }}
                >
                  {formatPrice(firstVariant.price)}
                </p>
              </>
            ) : (
              <p className="text-zinc-500 text-sm">Pricing coming soon</p>
            )}
          </div>

          <div className="text-right">
            {inStock ? (
              <p className="text-green-400 text-xs">{totalQty} available</p>
            ) : (
              <p className="text-red-400 text-xs">Out of stock</p>
            )}

            <p className="text-zinc-500 text-xs mt-1">
              {product.variants?.length || 0} option
              {product.variants?.length === 1 ? "" : "s"}
            </p>
          </div>
        </div>
      </div>
    </Link>
  );
}
