import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function GET() {
  try {
    const products = await stripe.products.list({
      expand: ["data.default_price"],
      limit: 100,
    });

    const filtered = products.data.filter(
      (p) => p.metadata?.type === "product"
    );

    return NextResponse.json({ products: filtered });
  } catch (err) {
    return NextResponse.json(
      { error: err.message },
      { status: 500 }
    );
  }
}
