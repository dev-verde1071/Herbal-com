import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  if (!stripe) {
    return NextResponse.json(
      { error: "Stripe is not configured." },
      { status: 500 }
    );
  }

  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig || !process.env.STRIPE_WEBHOOK_SECRET) {
    return NextResponse.json(
      { error: "Missing webhook signature." },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (error: any) {
    return NextResponse.json(
      { error: `Webhook Error: ${error.message}` },
      { status: 400 }
    );
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const existing = await db.order.findUnique({
        where: {
          stripeSessionId: session.id,
        },
      });

      if (existing) {
        return NextResponse.json({ received: true, duplicate: true });
      }

      const type = session.metadata?.type;
      const total = (session.amount_total || 0) / 100;
      const email =
        session.customer_details?.email || session.customer_email || null;

      const shipping = session.customer_details?.address;
      const shippingName = session.customer_details?.name || null;

      if (type === "cart") {
        const cart = session.metadata?.cart
          ? JSON.parse(session.metadata.cart)
          : [];

        const variantIds = cart.map((item: any) => item.variantId);

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

        const order = await db.order.create({
          data: {
            stripeSessionId: session.id,
            status: "PAID",
            total,
            email,
            shippingName,
            shippingLine1: shipping?.line1 || null,
            shippingLine2: shipping?.line2 || null,
            shippingCity: shipping?.city || null,
            shippingState: shipping?.state || null,
            shippingPostal: shipping?.postal_code || null,
            shippingCountry: shipping?.country || null,
            shippingStatus: "NOT_CREATED",
            metadata: {
              stripePaymentStatus: session.payment_status,
              type: "cart",
            },
            items: {
              create: cart.map((item: any) => {
                const variant = variants.find(
                  (v) => v.id === item.variantId
                );

                if (!variant) {
                  return {
                    name: "Unknown Product",
                    price: 0,
                    qty: Number(item.qty || 1),
                  };
                }

                return {
                  productId: variant.productId,
                  variantId: variant.id,
                  name: `${variant.product.name} - ${variant.label}`,
                  price: variant.price,
                  qty: Number(item.qty || 1),
                  image:
                    variant.images?.[0] ||
                    variant.product.images?.[0] ||
                    null,
                };
              }),
            },
          },
        });

        for (const item of cart) {
          const variant = variants.find((v) => v.id === item.variantId);
          const qty = Number(item.qty || 1);

          if (variant && variant.qty > 0) {
            await db.productVariant.update({
              where: { id: variant.id },
              data: {
                qty: Math.max(0, variant.qty - qty),
                inStock: variant.qty - qty > 0,
              },
            });
          }
        }

        console.log("Cart order saved:", order.id);
      }

      if (type === "product") {
        const variantId = session.metadata?.variantId;
        const productId = session.metadata?.productId;

        if (variantId) {
          const variant = await db.productVariant.findUnique({
            where: { id: variantId },
            include: { product: true },
          });

          if (variant) {
            await db.order.create({
              data: {
                stripeSessionId: session.id,
                status: "PAID",
                total,
                email,
                shippingName,
                shippingLine1: shipping?.line1 || null,
                shippingLine2: shipping?.line2 || null,
                shippingCity: shipping?.city || null,
                shippingState: shipping?.state || null,
                shippingPostal: shipping?.postal_code || null,
                shippingCountry: shipping?.country || null,
                shippingStatus: "NOT_CREATED",
                metadata: {
                  stripePaymentStatus: session.payment_status,
                  type: "product",
                },
                items: {
                  create: {
                    productId,
                    variantId,
                    name: `${variant.product.name} - ${variant.label}`,
                    price: variant.price,
                    qty: 1,
                    image:
                      variant.images?.[0] ||
                      variant.product.images?.[0] ||
                      null,
                  },
                },
              },
            });

            if (variant.qty > 0) {
              await db.productVariant.update({
                where: { id: variant.id },
                data: {
                  qty: Math.max(0, variant.qty - 1),
                  inStock: variant.qty - 1 > 0,
                },
              });
            }
          }
        }
      }

      if (type === "retreat") {
        const retreatId = session.metadata?.retreatId;

        if (retreatId) {
          const retreat = await db.retreat.findUnique({
            where: { id: retreatId },
          });

          if (retreat) {
            await db.order.create({
              data: {
                stripeSessionId: session.id,
                status: "PAID",
                total,
                email,
                shippingName,
                shippingLine1: shipping?.line1 || null,
                shippingLine2: shipping?.line2 || null,
                shippingCity: shipping?.city || null,
                shippingState: shipping?.state || null,
                shippingPostal: shipping?.postal_code || null,
                shippingCountry: shipping?.country || null,
                shippingStatus: "NOT_REQUIRED",
                metadata: {
                  stripePaymentStatus: session.payment_status,
                  type: "retreat",
                },
                items: {
                  create: {
                    retreatId,
                    name: retreat.name,
                    price: retreat.price,
                    qty: 1,
                    image: retreat.images[0],
                  },
                },
              },
            });

            await db.retreat.update({
              where: { id: retreat.id },
              data: {
                spotsLeft: Math.max(0, retreat.spotsLeft - 1),
                inStock: retreat.spotsLeft - 1 > 0,
              },
            });
          }
        }
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
