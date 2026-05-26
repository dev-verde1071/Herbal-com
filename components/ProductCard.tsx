"use client";
import Image from "next/image";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { formatPrice, CATEGORY_LABELS, CATEGORY_ICONS } from "@/lib/utils";

type Variant = { id: string; label: string; price: number; inStock: boolean };
type Props = {
  product: {
    id: string; name: string; slug: string;
    description?: string | null; images: string[];
    category: string; variants: Variant[];
  };
};

const CAT_STYLE: Record<string, string> = {
  herbs:      "bg-jungle-900/60 text-jungle-300 border-jungle-700/40",
  seamoss:    "bg-teal-900/60 text-teal-300 border-teal-700/40",
  honey:      "bg-yellow-900/60 text-yellow-300 border-yellow-700/40",
  oils:       "bg-orange-900/60 text-orange-300 border-orange-700/40",
  mushrooms:  "bg-purple-900/60 text-purple-300 border-purple-700/40",
  hairskin:   "bg-pink-900/60 text-pink-300 border-pink-700/40",
  packages:   "bg-blue-900/60 text-blue-300 border-blue-700/40",
  foods:      "bg-amber-900/60 text-amber-300 border-amber-700/40",
  duckflower: "bg-red-900/60 text-red-300 border-red-700/40",
};

export default function ProductCard({ product }: Props) {
  const lowestPrice = product.variants.length > 0 ? Math.min(...product.variants.map((v) => v.price)) : null;
  const hasInStock   = product.variants.some((v) => v.inStock);
  const image        = product.images[0] || null;
  const catStyle     = CAT_STYLE[product.category] || CAT_STYLE.herbs;
  const catLabel     = CATEGORY_LABELS[product.category] || product.category;
  const catIcon      = CATEGORY_ICONS[product.category] || "🌿";

  return (
    <div className="product-card rounded-2xl overflow-hidden bg-bark-800/60 border border-jungle-900/60 flex flex-col group">
      <Link href={`/products/${product.slug}`} className="block relative w-full h-56 bg-jungle-950 overflow-hidden">
        {image ? (
          <Image src={image} alt={product.name} fill
            className="object-cover group-hover:scale-105 transition-transform duration-500"
            sizes="(max-width:768px) 100vw,33vw" />
        ) : (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-jungle-700">
            <span className="text-5xl">{catIcon}</span>
            <span className="text-xs">Photo coming soon</span>
          </div>
        )}
        {!hasInStock && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-sm font-semibold text-gray-300 bg-black/60 px-3 py-1 rounded-full">Out of Stock</span>
          </div>
        )}
        <div className="absolute top-3 left-3">
          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full border ${catStyle}`}>{catLabel}</span>
        </div>
      </Link>

      <div className="p-4 flex flex-col gap-3 flex-1">
        <div>
          <Link href={`/products/${product.slug}`}>
            <h3 className="font-semibold text-white hover:text-jungle-300 transition line-clamp-2 leading-snug">{product.name}</h3>
          </Link>
          {product.description && (
            <p className="text-xs text-gray-400 mt-1 line-clamp-2">{product.description}</p>
          )}
        </div>

        <div className="mt-auto flex items-center justify-between gap-3 pt-2 border-t border-jungle-900/40">
          <div>
            {lowestPrice !== null
              ? <p className="text-sm font-bold" style={{ color: "#c89f4f" }}>From {formatPrice(lowestPrice)}</p>
              : <p className="text-sm text-gray-500">Price varies</p>
            }
            <p className="text-xs text-gray-500">{product.variants.length} size{product.variants.length !== 1 ? "s" : ""}</p>
          </div>
          <Link href={`/products/${product.slug}`}
            className={`flex items-center gap-1.5 text-xs font-semibold px-3 py-2 rounded-xl transition ${
              hasInStock ? "bg-jungle-600 hover:bg-jungle-500 text-white" : "bg-gray-800 text-gray-500 cursor-not-allowed pointer-events-none"
            }`}>
            <ShoppingBag className="w-3.5 h-3.5" />
            {hasInStock ? "View" : "Sold Out"}
          </Link>
        </div>
      </div>
    </div>
  );
}
