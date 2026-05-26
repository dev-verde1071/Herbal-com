import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { db } from "@/lib/db";

export async function POST(req: Request) {
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

      const type = session.metadata?.type;
      const variantId = session.metadata?.variantId;
      const productId = session.metadata?.productId;
      const retreatId = session.metadata?.retreatId;

      const total = (session.amount_total || 0) / 100;
      const email =
        session.customer_details?.email ||
        session.customer_email ||
        null;

      if (type === "product" && variantId) {
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
              items: {
                create: {
                  productId,
                  variantId,
                  name: `${variant.product.name} - ${variant.label}`,
                  price: variant.price,
                  qty: 1,
                  image: variant.product.images[0],
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

      if (type === "retreat" && retreatId) {
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

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook handler error:", error);

    return NextResponse.json(
      { error: "Webhook handler failed." },
      { status: 500 }
    );
  }
}
