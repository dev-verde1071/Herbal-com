import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(amount: number, currency = "usd"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const PRODUCT_CATEGORIES = [
  { value: "herbs",      label: "Herbs & Botanicals" },
  { value: "seamoss",    label: "Sea Moss" },
  { value: "honey",      label: "Rare Honeys" },
  { value: "oils",       label: "Oils" },
  { value: "mushrooms",  label: "Mushrooms" },
  { value: "hairskin",   label: "Hair & Skin Care" },
  { value: "packages",   label: "Herbal Packages" },
  { value: "foods",      label: "Foods & Superfoods" },
  { value: "duckflower", label: "Duck Flower" },
] as const;

export const CATEGORY_LABELS: Record<string, string> = {
  herbs:      "Herbs & Botanicals",
  seamoss:    "Sea Moss",
  honey:      "Rare Honeys",
  oils:       "Oils",
  mushrooms:  "Mushrooms",
  hairskin:   "Hair & Skin Care",
  packages:   "Herbal Package",
  foods:      "Foods & Superfoods",
  duckflower: "Duck Flower",
};

export const CATEGORY_ICONS: Record<string, string> = {
  herbs:      "🌿",
  seamoss:    "🌊",
  honey:      "🍯",
  oils:       "🫙",
  mushrooms:  "🍄",
  hairskin:   "✨",
  packages:   "📦",
  foods:      "🥥",
  duckflower: "🌺",
};
