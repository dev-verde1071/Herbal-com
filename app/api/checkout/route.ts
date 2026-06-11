import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { getOrCreateDbUser } from "@/lib/currentUser";

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

function getRetreatCheckoutPrice(retreat: {
  price: number;
  clearanceActive: boolean;
  clearancePrice?: number | null;
  clearancePercent?: number | null;
}) {
  if (retreat.clearanceActive) {
    if (retreat.clearancePrice && retreat.clearancePrice > 0) {
      return retreat.clearancePrice;
    }

    if (retreat.clearancePercent && retreat.clearancePercent > 0) {
      const discount = retreat.price * (retreat.clearancePercent / 100);
      return Math.max(0, retreat.price - discount);
    }
  }

  return retreat.price;
}

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

    const dbUser = userId ? await getOrCreateDbUser() : null;

    const siteUrl =
      process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (fromSavedCart) {
      if (!dbUser) {
        return NextResponse.json(
          { error: "Please sign in before checking out." },
          { status: 401 }
        );
      }

      const cart = await db.cart.findFirst({
        where: { userId: dbUser.id },
        include: {
          items: {
            include: {
              product: true,
              variant: true,
              retreat: true,
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

      const hasRetreat = cart.items.some((item) => item.retreatId);
      const hasWholesale = cart.items.some(
        (item) => item.product?.type === "WHOLESALE"
      );

      const lineItems = cart.items.map((item) => {
        if (item.retreat) {
          if (
            !item.retreat.active ||
            !item.retreat.inStock ||
            item.retreat.spotsLeft <= 0
          ) {
            throw new Error(`${item.retreat.name} is fully booked.`);
          }

          if (item.qty > item.retreat.spotsLeft) {
            throw new Error(
              `Only ${item.retreat.spotsLeft} spots available for ${item.retreat.name}.`
            );
          }

          const checkoutPrice = getRetreatCheckoutPrice(item.retreat);

          return {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(checkoutPrice * 100),
              product_data: {
                name: item.retreat.name,
                description: item.retreat.description || undefined,
              },
            },
            quantity: item.qty,
          };
        }

        if (!item.variant || !item.product) {
          throw new Error("One or more cart items are unavailable.");
        }

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

      const orderType = hasRetreat
        ? "RETREAT"
        : hasWholesale
          ? "WHOLESALE"
          : "RETAIL";

      const cartMetadata = cart.items.map((item) => ({
        variantId: item.variantId,
        retreatId: item.retreatId,
        qty: item.qty,
      }));

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
        customer_creation: "always",
        shipping_address_collection: hasRetreat
          ? undefined
          : {
              allowed_countries: ["US"],
            },
        shipping_options: hasRetreat ? undefined : [STANDARD_SHIPPING],
        line_items: lineItems,
        metadata: {
          type: "cart",
          orderType,
          userId: dbUser.id,
          cartId: cart.id,
          cart: JSON.stringify(cartMetadata).slice(0, 450),
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (Array.isArray(items) && items.length > 0) {
      const variantIds = items
        .map((item: any) => item.variantId)
        .filter(Boolean);

      const retreatIds = items
        .map((item: any) => item.retreatId)
        .filter(Boolean);

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

      const retreats = await db.retreat.findMany({
        where: {
          id: {
            in: retreatIds,
          },
        },
      });

      const lineItems = items.map((item: any) => {
        const qty = Math.max(1, Number(item.qty || 1));

        if (item.retreatId) {
          const retreat = retreats.find((r) => r.id === item.retreatId);

          if (!retreat || !retreat.active || !retreat.inStock) {
            throw new Error("One or more retreats are unavailable.");
          }

          if (retreat.spotsLeft <= 0) {
            throw new Error(`${retreat.name} is fully booked.`);
          }

          if (qty > retreat.spotsLeft) {
            throw new Error(
              `Only ${retreat.spotsLeft} spots available for ${retreat.name}.`
            );
          }

          const checkoutPrice = getRetreatCheckoutPrice(retreat);

          return {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(checkoutPrice * 100),
              product_data: {
                name: retreat.name,
                description: retreat.description || undefined,
              },
            },
            quantity: qty,
          };
        }

        const variant = variants.find((v) => v.id === item.variantId);

        if (!variant || !variant.product || !variant.inStock) {
          throw new Error("One or more cart items are unavailable.");
        }

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

      const hasRetreat = retreatIds.length > 0;
      const hasWholesale = variants.some(
        (variant) => variant.product.type === "WHOLESALE"
      );

      const orderType = hasRetreat
        ? "RETREAT"
        : hasWholesale
          ? "WHOLESALE"
          : "RETAIL";

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/cart`,
        customer_creation: "always",
        shipping_address_collection: hasRetreat
          ? undefined
          : {
              allowed_countries: ["US"],
            },
        shipping_options: hasRetreat ? undefined : [STANDARD_SHIPPING],
        line_items: lineItems,
        metadata: {
          type: "cart",
          orderType,
          userId: dbUser?.id || "",
          cart: JSON.stringify(
            items.map((item: any) => ({
              variantId: item.variantId || null,
              retreatId: item.retreatId || null,
              qty: Math.max(1, Number(item.qty || 1)),
            }))
          ).slice(0, 450),
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
          userId: dbUser?.id || "",
        },
      });

      return NextResponse.json({ url: session.url });
    }

    if (retreatId) {
      const retreat = await db.retreat.findUnique({
        where: { id: retreatId },
      });

      if (!retreat || !retreat.active || !retreat.inStock) {
        return NextResponse.json(
          { error: "Retreat unavailable." },
          { status: 400 }
        );
      }

      if (retreat.spotsLeft <= 0) {
        return NextResponse.json(
          { error: "This trip is fully booked." },
          { status: 400 }
        );
      }

      const checkoutPrice = getRetreatCheckoutPrice(retreat);

      const session = await stripe.checkout.sessions.create({
        mode: "payment",
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/retreats`,
        customer_creation: "always",
        line_items: [
          {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(checkoutPrice * 100),
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
          userId: dbUser?.id || "",
          originalPrice: String(retreat.price),
          checkoutPrice: String(checkoutPrice),
          clearanceActive: String(retreat.clearanceActive),
          clearancePercent: retreat.clearancePercent
            ? String(retreat.clearancePercent)
            : "",
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
