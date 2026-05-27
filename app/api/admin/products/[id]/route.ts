import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  const { id } = await params;

  const product = await db.product.findUnique({
    where: { id },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json({ error: "Product not found." }, { status: 404 });
  }

  return NextResponse.json(product);
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const {
      name,
      description,
      category,
      subcategory,
      type,
      images,
      active,
      featured,
      variants,
      metadata,
    } = body;

    await db.productVariant.deleteMany({
      where: {
        productId: id,
      },
    });

    const product = await db.product.update({
      where: { id },
      data: {
        name,
        description,
        category,
        subcategory,
        type: type || "RETAIL",
        images: Array.isArray(images) ? images : [],
        active: active ?? true,
        featured: featured ?? false,
        metadata: metadata || {},
        variants: {
          create:
            variants?.map((variant: any) => ({
              label: variant.label,
              price: Number(variant.price),
              compareAt: variant.compareAt ? Number(variant.compareAt) : null,
              sku: variant.sku || null,
              qty: Number(variant.qty || 0),
              inStock: variant.inStock ?? true,
              images: Array.isArray(variant.images) ? variant.images : [],
              stripePriceId: variant.stripePriceId || null,
              metadata: variant.metadata || {},
            })) || [],
        },
      },
      include: {
        variants: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;

    await db.product.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
