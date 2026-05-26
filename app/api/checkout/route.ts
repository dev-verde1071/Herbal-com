import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { variantId, retreatId } = body;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (variantId) {
      const variant = await db.productVariant.findUnique({
        where: { id: variantId },
        include: { product: true },
      });

      if (!variant || !variant.product || !variant.inStock) {
        return NextResponse.json(
          { error: "Product unavailable." },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/products/${variant.product.slug}`,
        customer_creation: "always",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(variant.price * 100),
              product_data: {
                name: `${variant.product.name} - ${variant.label}`,
                description: variant.product.description || undefined,
                images: variant.product.images?.slice(0, 1),
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          variantId: variant.id,
          productId: variant.product.id,
          type: "product",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (retreatId) {
      const retreat = await db.retreat.findUnique({
        where: { id: retreatId },
      });

      if (!retreat || !retreat.inStock || retreat.spotsLeft <= 0) {
        return NextResponse.json(
          { error: "Retreat unavailable." },
          { status: 400 }
        );
      }

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/retreats`,
        customer_creation: "always",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(retreat.price * 100),
              product_data: {
                name: retreat.name,
                description: retreat.description || undefined,
                images: retreat.images?.slice(0, 1),
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          retreatId: retreat.id,
          type: "retreat",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    return NextResponse.json(
      { error: "Missing checkout item." },
      { status: 400 }
    );
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Checkout failed." },
      { status: 500 }
    );
  }
}
