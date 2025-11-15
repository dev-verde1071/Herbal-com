import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export const config = {
  api: {
    bodyParser: false,
  },
};

function bufferToString(buffer) {
  return new TextDecoder("utf-8").decode(buffer);
}

export async function POST(request) {
  const rawBody = await request.arrayBuffer();
  const signature = request.headers.get("stripe-signature");

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      Buffer.from(rawBody),
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err) {
    console.error("❌ Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  // Log event type
  console.log("🔔 Stripe Event:", event.type);

  try {
    switch (event.type) {
      /* -------------------------------
         PRODUCT & PRICE SYNC EVENTS
      --------------------------------*/
      case "product.created":
      case "product.updated":
      case "product.deleted":
        console.log("🔄 Product updated → Refresh frontend cache");
        break;

      case "price.created":
      case "price.updated":
        console.log("💲 Price updated → Refresh frontend cache");
        break;

      /* -------------------------------
         CHECKOUT EVENTS
      --------------------------------*/
      case "checkout.session.completed":
        const session = event.data.object;
        console.log("✅ Checkout Completed:", session.id);
        break;

      /* More events can be added here */
      default:
        console.log(`ℹ️ Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.error("❌ Webhook Handler Error:", err);
    return NextResponse.json({ error: "Webhook handler failure" }, { status: 500 });
  }
}
