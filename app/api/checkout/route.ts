import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured yet." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, variantId, retreatId } = body;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (Array.isArray(items) && items.length > 0) {
      const variantIds = items.map((item: any) => item.variantId);

      const variants = await db.productVariant.findMany({
        where: {
          id: {
            in: variantIds,
          },
        },
        include: {
          product: true,
        },
      });

      const lineItems = items.map((item: any) => {
        const variant = variants.find((v) => v.id === item.variantId);

        if (!variant || !variant.product || !variant.inStock) {
          throw new Error("One or more cart items are unavailable.");
        }

        const qty = Math.max(1, Number(item.qty || 1));

        if (variant.qty > 0 && qty > variant.qty) {
          throw new Error(
            `Only ${variant.qty} available for ${variant.product.name}.`
          );
        }

        return {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(variant.price * 100),
            product_data: {
              name: `${variant.product.name} - ${variant.label}`,
              description: variant.product.description || undefined,
            },
          },
          quantity: qty,
        };
      });

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
        customer_creation: "always",
        line_items: lineItems,
        metadata: {
          type: "cart",
        },
      });

      return NextResponse.json({ url: session.url });
    }

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
  } catch (error: any) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: error.message || "Checkout failed." },
      { status: 500 }
    );
  }
}
