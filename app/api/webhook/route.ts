import crypto from "crypto";
import { headers } from "next/headers";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import OrderConfirmation from "@/emails/OrderConfirmation";

export const dynamic = "force-dynamic";

function getRetreatPrice(retreat: any, metadataPrice?: string) {
  if (metadataPrice) return Number(metadataPrice);

  if (retreat.clearanceActive && retreat.clearancePrice) {
    return retreat.clearancePrice;
  }

  if (retreat.clearanceActive && retreat.clearancePercent) {
    return Math.max(
      0,
      retreat.price - retreat.price * (retreat.clearancePercent / 100)
    );
  }

  return retreat.price;
}

async function sendConfirmationEmail(orderId: string) {
  try {
    const order = await db.order.findUnique({
      where: {
        id: orderId,
      },
      include: {
        items: true,
      },
    });

    if (!order || !order.email || !resend) return;

    await resend.emails.send({
      from: FROM_EMAIL,
      to: order.email,
      subject:
        order.orderType === "RETREAT"
          ? "Your Herbal Communities Retreat Booking Is Confirmed"
          : "Your Herbal Communities Order Is Confirmed",
      react: OrderConfirmation({
        customerName: order.shippingName || "there",
        orderId: order.id,
        total: Number(order.total || 0),
        items: order.items.map((item) => ({
          name: item.name,
          qty: item.qty,
          price: item.price,
          image: item.image || undefined,
        })),
      }),
    });
  } catch (error) {
    console.error("Order confirmation email error:", error);
  }
}

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
      return new Response(`Webhook Error: ${error.message}`, { status: 400 });
    }

    if (event.type !== "checkout.session.completed") {
      return new Response("OK", { status: 200 });
    }

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

    if (metadata.type === "saved_cart" && metadata.cartId) {
      const cart = await db.cart.findUnique({
        where: {
          id: metadata.cartId,
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

      if (cart) {
        for (const item of cart.items) {
          const qty = Number(item.qty || 1);

          if (item.retreat) {
            const latestRetreat = await db.retreat.findUnique({
              where: {
                id: item.retreat.id,
              },
            });

            if (!latestRetreat) continue;

            const price = getRetreatPrice(latestRetreat);

            const orderItem = await db.orderItem.create({
              data: {
                orderId: order.id,
                retreatId: latestRetreat.id,
                name: latestRetreat.name,
                price,
                qty,
                image: latestRetreat.images?.[0] || null,
              },
            });

            await db.retreat.update({
              where: {
                id: latestRetreat.id,
              },
              data: {
                spotsLeft: {
                  decrement: qty,
                },
                inStock:
                  latestRetreat.spotsLeft - qty <= 0
                    ? false
                    : latestRetreat.inStock,
              },
            });

            for (let i = 0; i < qty; i++) {
              await db.retreatGuest.create({
                data: {
                  userId: metadata.userId || undefined,
                  retreatId: latestRetreat.id,
                  orderId: order.id,
                  orderItemId: orderItem.id,
                  name:
                    order.shippingName ||
                    customerDetails?.name ||
                    "Retreat Guest",
                  email: order.email || undefined,
                  phone: customerDetails?.phone || undefined,
                  status: "BOOKED",
                },
              });
            }

            continue;
          }

          if (item.variant && item.product) {
            const latestVariant = await db.productVariant.findUnique({
              where: {
                id: item.variant.id,
              },
              include: {
                product: true,
              },
            });

            if (!latestVariant || !latestVariant.product) continue;

            await db.orderItem.create({
              data: {
                orderId: order.id,
                productId: latestVariant.product.id,
                variantId: latestVariant.id,
                name: `${latestVariant.product.name} - ${latestVariant.label}`,
                price: latestVariant.price,
                qty,
                image:
                  latestVariant.images?.[0] ||
                  latestVariant.product.images?.[0] ||
                  null,
              },
            });

            await db.productVariant.update({
              where: {
                id: latestVariant.id,
              },
              data: {
                qty: {
                  decrement: qty,
                },
                inStock:
                  latestVariant.qty - qty <= 0
                    ? false
                    : latestVariant.inStock,
              },
            });
          }
        }

        await db.cartItem.deleteMany({
          where: {
            cartId: cart.id,
          },
        });
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
            inStock: variant.qty - 1 <= 0 ? false : variant.inStock,
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
        const price = getRetreatPrice(retreat, metadata.checkoutPrice);

        const orderItem = await db.orderItem.create({
          data: {
            orderId: order.id,
            retreatId: retreat.id,
            name: retreat.name,
            price,
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
            inStock: retreat.spotsLeft - 1 <= 0 ? false : retreat.inStock,
          },
        });

        await db.retreatGuest.create({
          data: {
            userId: metadata.userId || undefined,
            retreatId: retreat.id,
            orderId: order.id,
            orderItemId: orderItem.id,
            name: order.shippingName || customerDetails?.name || "Retreat Guest",
            email: order.email || undefined,
            phone: customerDetails?.phone || undefined,
            status: "BOOKED",
          },
        });
      }
    }

    await sendConfirmationEmail(order.id);

    return new Response("OK", { status: 200 });
  } catch (error) {
    console.error("Webhook route error:", error);

    return new Response("Webhook error", {
      status: 500,
    });
  }
}
