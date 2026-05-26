import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;

    const product = await db.product.findUnique({
      where: { slug },
      include: {
        variants: {
          orderBy: {
            price: "asc",
          },
        },
      },
    });

    if (!product || !product.active) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("Product API error:", error);

    return NextResponse.json(
      { error: "Failed to fetch product." },
      { status: 500 }
    );
  }
}
