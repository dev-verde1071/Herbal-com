import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  try {
    if (!stripe) {
      return new Response("Stripe not configured", { status: 500 });
    }

    const body = await req.text();

    const signature = (await headers()).get("stripe-signature");

    if (!signature) {
      return new Response("Missing stripe signature", { status: 400 });
    }

    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

    if (!webhookSecret) {
      return new Response("Missing webhook secret", { status: 500 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } catch (error: any) {
      console.error("Webhook verification failed:", error.message);

      return new Response(`Webhook Error: ${error.message}`, {
        status: 400,
      });
    }

    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const metadata = session.metadata || {};
      const customerDetails = session.customer_details;
      const shipping = session.shipping_details;

      const existingOrder = await db.order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existingOrder) {
        return new Response("Order already processed", { status: 200 });
      }

      const order = await db.order.create({
        data: {
          stripeSessionId: session.id,
          status: "PAID",
          orderType: metadata.orderType || "RETAIL",
          total: Number((session.amount_total || 0) / 100),
          currency: session.currency || "usd",
          email: customerDetails?.email || session.customer_email || undefined,

          userId: metadata.userId || undefined,

          shippingName: shipping?.name || customerDetails?.name || undefined,
          shippingLine1: shipping?.address?.line1 || undefined,
          shippingLine2: shipping?.address?.line2 || undefined,
          shippingCity: shipping?.address?.city || undefined,
          shippingState: shipping?.address?.state || undefined,
          shippingPostal: shipping?.address?.postal_code || undefined,
          shippingCountry: shipping?.address?.country || undefined,

          shippingStatus:
            metadata.orderType === "RETREAT" ? "NOT_REQUIRED" : "NOT_CREATED",

          metadata,
        },
      });

      if (metadata.type === "cart" && metadata.cart) {
        try {
          const cartItems = JSON.parse(metadata.cart);

          for (const item of cartItems) {
            const qty = Number(item.qty || 1);

            if (item.retreatId) {
              const retreat = await db.retreat.findUnique({
                where: {
                  id: item.retreatId,
                },
              });

              if (!retreat) continue;

              const checkoutPrice =
                retreat.clearanceActive && retreat.clearancePrice
                  ? retreat.clearancePrice
                  : retreat.clearanceActive && retreat.clearancePercent
                    ? Math.max(
                        0,
                        retreat.price -
                          retreat.price * (retreat.clearancePercent / 100)
                      )
                    : retreat.price;

              await db.orderItem.create({
                data: {
                  orderId: order.id,
                  retreatId: retreat.id,
                  name: retreat.name,
                  price: checkoutPrice,
                  qty,
                  image: retreat.images?.[0] || null,
                },
              });

              await db.retreat.update({
                where: {
                  id: retreat.id,
                },
                data: {
                  spotsLeft: {
                    decrement: qty,
                  },
                },
              });

              continue;
            }

            if (item.variantId) {
              const variant = await db.productVariant.findUnique({
                where: {
                  id: item.variantId,
                },
                include: {
                  product: true,
                },
              });

              if (!variant || !variant.product) continue;

              await db.orderItem.create({
                data: {
                  orderId: order.id,
                  productId: variant.product.id,
                  variantId: variant.id,
                  name: `${variant.product.name} - ${variant.label}`,
                  price: variant.price,
                  qty,
                  image: variant.images?.[0] || variant.product.images?.[0] || null,
                },
              });

              await db.productVariant.update({
                where: {
                  id: variant.id,
                },
                data: {
                  qty: {
                    decrement: qty,
                  },
                },
              });
            }
          }

          if (metadata.userId) {
            const cart = await db.cart.findFirst({
              where: {
                userId: metadata.userId,
              },
            });

            if (cart) {
              await db.cartItem.deleteMany({
                where: {
                  cartId: cart.id,
                },
              });
            }
          }
        } catch (error) {
          console.error("Cart metadata parse error:", error);
        }
      }

      if (metadata.type === "product" && metadata.variantId) {
        const variant = await db.productVariant.findUnique({
          where: {
            id: metadata.variantId,
          },
          include: {
            product: true,
          },
        });

        if (variant && variant.product) {
          await db.orderItem.create({
            data: {
              orderId: order.id,
              productId: variant.product.id,
              variantId: variant.id,
              name: `${variant.product.name} - ${variant.label}`,
              price: variant.price,
              qty: 1,
              image: variant.images?.[0] || variant.product.images?.[0] || null,
            },
          });

          await db.productVariant.update({
            where: {
              id: variant.id,
            },
            data: {
              qty: {
                decrement: 1,
              },
            },
          });
        }
      }

      if (metadata.type === "retreat" && metadata.retreatId) {
        const retreat = await db.retreat.findUnique({
          where: {
            id: metadata.retreatId,
          },
        });

        if (retreat) {
          const checkoutPrice = metadata.checkoutPrice
            ? Number(metadata.checkoutPrice)
            : retreat.clearanceActive && retreat.clearancePrice
              ? retreat.clearancePrice
              : retreat.clearanceActive && retreat.clearancePercent
                ? Math.max(
                    0,
                    retreat.price -
                      retreat.price * (retreat.clearancePercent / 100)
                  )
                : retreat.price;

          await db.orderItem.create({
            data: {
              orderId: order.id,
              retreatId: retreat.id,
              name: retreat.name,
              price: checkoutPrice,
              qty: 1,
              image: retreat.images?.[0] || null,
            },
          });

          await db.retreat.update({
            where: {
              id: retreat.id,
            },
            data: {
              spotsLeft: {
                decrement: 1,
              },
            },
          });
        }
      }
    }

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook route error:", error);

    return new Response("Webhook error", {
      status: 500,
    });
  }
}
