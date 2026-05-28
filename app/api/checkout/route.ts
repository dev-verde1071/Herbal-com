import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";

const STANDARD_SHIPPING = {
  shipping_rate_data: {
    type: "fixed_amount" as const,
    fixed_amount: {
      amount: 800,
      currency: "usd",
    },
    display_name: "Standard Shipping",
    delivery_estimate: {
      minimum: {
        unit: "business_day" as const,
        value: 3,
      },
      maximum: {
        unit: "business_day" as const,
        value: 7,
      },
    },
  },
};

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured yet." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const { items, variantId, retreatId, fromSavedCart } = body;

    const { userId } = await auth();

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (fromSavedCart) {
      if (!userId) {
        return NextResponse.json(
          { error: "Please sign in before checking out." },
          { status: 401 }
        );
      }

      const cart = await db.cart.findFirst({
        where: { userId },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return NextResponse.json(
          { error: "Your cart is empty." },
          { status: 400 }
        );
      }

      const lineItems = cart.items.map((item) => {
        if (!item.variant.inStock || item.variant.qty <= 0) {
          throw new Error(`${item.product.name} is unavailable.`);
        }

        if (item.qty > item.variant.qty) {
          throw new Error(
            `Only ${item.variant.qty} available for ${item.product.name}.`
          );
        }

        return {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.variant.price * 100),
            product_data: {
              name: `${item.product.name} - ${item.variant.label}`,
              description: item.product.description || undefined,
            },
          },
          quantity: item.qty,
        };
      });

      const orderType = cart.items.some((item) => item.product.type === "WHOLESALE")
        ? "WHOLESALE"
        : "RETAIL";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
        customer_creation: "always",
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        shipping_options: [STANDARD_SHIPPING],
        line_items: lineItems,
        metadata: {
          type: "cart",
          orderType,
          userId,
          cartId: cart.id,
          cart: JSON.stringify(
            cart.items.map((item) => ({
              variantId: item.variantId,
              qty: item.qty,
            }))
          ).slice(0, 450),
        },
      });

      return NextResponse.json({ url: session.url });
    }

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

      const cartMetadata = items.map((item: any) => ({
        variantId: item.variantId,
        qty: Math.max(1, Number(item.qty || 1)),
      }));

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

      const orderType = variants.some((variant) => variant.product.type === "WHOLESALE")
        ? "WHOLESALE"
        : "RETAIL";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
        customer_creation: "always",
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        shipping_options: [STANDARD_SHIPPING],
        line_items: lineItems,
        metadata: {
          type: "cart",
          orderType,
          userId: userId || "",
          cart: JSON.stringify(cartMetadata).slice(0, 450),
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
        shipping_address_collection: {
          allowed_countries: ["US"],
        },
        shipping_options: [STANDARD_SHIPPING],
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
          orderType:
            variant.product.type === "WHOLESALE" ? "WHOLESALE" : "RETAIL",
          userId: userId || "",
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
          orderType: "RETREAT",
          userId: userId || "",
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
