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
      return Math.max(
        0,
        retreat.price - retreat.price * (retreat.clearancePercent / 100)
      );
    }
  }

  return retreat.price;
}

function getStripeImages(image?: string | null) {
  if (!image) return undefined;

  if (!image.startsWith("http")) return undefined;

  return [image];
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

    const { variantId, retreatId, fromSavedCart } = body;

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
        where: {
          userId: dbUser.id,
        },
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

          const price = getRetreatCheckoutPrice(item.retreat);
          const image = item.retreat.images?.[0] || null;

          return {
            price_data: {
              currency: "usd",
              unit_amount: Math.round(price * 100),
              product_data: {
                name: item.retreat.name,
                description: item.retreat.description || undefined,
                images: getStripeImages(image),
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

        const image = item.variant.images?.[0] || item.product.images?.[0] || null;

        return {
          price_data: {
            currency: "usd",
            unit_amount: Math.round(item.variant.price * 100),
            product_data: {
              name: `${item.product.name} - ${item.variant.label}`,
              description: item.product.description || undefined,
              images: getStripeImages(image),
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
          type: "saved_cart",
          orderType,
          userId: dbUser.id,
          cartId: cart.id,
        },
      });

      return NextResponse.json({
        url: session.url,
      });
    }

    if (variantId) {
      const variant = await db.productVariant.findUnique({
        where: {
          id: String(variantId),
        },
        include: {
          product: true,
        },
      });

      if (
        !variant ||
        !variant.product ||
        !variant.inStock ||
        variant.qty <= 0
      ) {
        return NextResponse.json(
          { error: "Product unavailable." },
          { status: 400 }
        );
      }

      const image = variant.images?.[0] || variant.product.images?.[0] || null;

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
                images: getStripeImages(image),
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "product",
          orderType:
            variant.product.type === "WHOLESALE" ? "WHOLESALE" : "RETAIL",
          userId: dbUser?.id || "",
          variantId: variant.id,
          productId: variant.product.id,
        },
      });

      return NextResponse.json({
        url: session.url,
      });
    }

    if (retreatId) {
      const retreat = await db.retreat.findUnique({
        where: {
          id: String(retreatId),
        },
      });

      if (
        !retreat ||
        !retreat.active ||
        !retreat.inStock ||
        retreat.spotsLeft <= 0
      ) {
        return NextResponse.json(
          { error: "This trip is fully booked." },
          { status: 400 }
        );
      }

      const checkoutPrice = getRetreatCheckoutPrice(retreat);
      const image = retreat.images?.[0] || null;

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
                images: getStripeImages(image),
              },
            },
            quantity: 1,
          },
        ],
        metadata: {
          type: "retreat",
          orderType: "RETREAT",
          userId: dbUser?.id || "",
          retreatId: retreat.id,
          checkoutPrice: String(checkoutPrice),
        },
      });

      return NextResponse.json({
        url: session.url,
      });
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
