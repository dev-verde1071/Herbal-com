import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("⚠️ Missing STRIPE_SECRET_KEY in environment variables");
}

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: "2024-10-28",
  appInfo: { name: "Herbal Communities", version: "1.0.0" },
});

/**
 * Fetch products from Stripe
 */
export async function getStripeProductsByType(type: "product" | "tour") {
  const products = await stripe.products.list({ active: true });

  const filtered = products.data.filter((p) =>
    type === "product"
      ? !p.metadata.category || p.metadata.category === "product"
      : p.metadata.category === "tour"
  );

  const prices = await stripe.prices.list({ active: true });
  const priceMap = new Map(prices.data.map((p) => [p.product, p.unit_amount]));

  return filtered.map((p) => ({
    id: p.id,
    name: p.name,
    description: p.description,
    price: priceMap.get(p.id)
      ? `$${(priceMap.get(p.id)! / 100).toFixed(2)}`
      : "N/A",
    image: p.images?.[0] || "/placeholder.png",
  }));
}
