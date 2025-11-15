import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/db";

// Stripe sends the raw body, so we must disable the default body parser
export const config = {
  api: { bodyParser: false },
};

// Helper to read the raw request stream
async function buffer(readable: ReadableStream<Uint8Array>) {
  const chunks = [];
  const reader = readable.getReader();
  while (true) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
  }
  return Buffer.concat(chunks);
}

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");
  const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!sig || !endpointSecret) {
    return NextResponse.json({ error: "Missing signature or secret" }, { status: 400 });
  }

  let event;
  try {
    const rawBody = await buffer(req.body!);
    event = stripe.webhooks.constructEvent(rawBody, sig, endpointSecret);
  } catch (err: any) {
    console.error("Webhook signature verification failed:", err.message);
    return NextResponse.json({ error: err.message }, { status: 400 });
  }

  try {
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as any;

      await prisma.order.create({
        data: {
          stripeSession: session.id,
          totalAmount: session.amount_total / 100,
          // Optional: you can store userId once auth is added
        },
      });

      console.log(`✅ Order saved for session: ${session.id}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Error saving order:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
