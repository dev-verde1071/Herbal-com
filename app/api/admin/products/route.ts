import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { slugify } from "@/lib/utils";

export async function GET() {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const products = await db.product.findMany({
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(products);
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
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

    if (!name || !category) {
      return NextResponse.json(
        { error: "Name and category are required." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await db.product.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const product = await db.product.create({
      data: {
        name,
        slug,
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
              compareAt: variant.compareAt
                ? Number(variant.compareAt)
                : null,
              sku: variant.sku || null,
              qty: Number(variant.qty || 0),
              inStock: variant.inStock ?? true,
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
    console.error("Create product error:", error);

    return NextResponse.json(
      { error: "Failed to create product." },
      { status: 500 }
    );
  }
}
