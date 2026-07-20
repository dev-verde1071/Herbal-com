import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

const MAX_WHOLESALE_FEATURED_PRODUCTS = 6;

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;

  const product = await db.product.findUnique({
    where: {
      id,
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
  });

  if (!product) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        type: true,
        featured: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    const requestedFeatured =
      typeof body.featured === "boolean"
        ? body.featured
        : existingProduct.featured;

    const requestedType =
      body.type === "RETAIL" ||
      body.type === "WHOLESALE" ||
      body.type === "BOTH"
        ? body.type
        : existingProduct.type;

    if (
      requestedFeatured &&
      requestedType === "WHOLESALE" &&
      !existingProduct.featured
    ) {
      const featuredWholesaleCount = await db.product.count({
        where: {
          type: "WHOLESALE",
          featured: true,
          NOT: {
            id,
          },
        },
      });

      if (
        featuredWholesaleCount >=
        MAX_WHOLESALE_FEATURED_PRODUCTS
      ) {
        return NextResponse.json(
          {
            error:
              "Only six wholesale products may be featured at one time. Unfeature another wholesale product first.",
          },
          { status: 400 }
        );
      }
    }

    const allowedData: {
      featured?: boolean;
      active?: boolean;
    } = {};

    if (typeof body.featured === "boolean") {
      allowedData.featured = body.featured;
    }

    if (typeof body.active === "boolean") {
      allowedData.active = body.active;
    }

    if (Object.keys(allowedData).length === 0) {
      return NextResponse.json(
        { error: "No supported fields were provided." },
        { status: 400 }
      );
    }

    const product = await db.product.update({
      where: {
        id,
      },
      data: allowedData,
      include: {
        variants: {
          orderBy: {
            price: "asc",
          },
        },
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("Patch product error:", error);

    return NextResponse.json(
      { error: "Failed to update product." },
      { status: 500 }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const existingProduct = await db.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
        type: true,
        featured: true,
      },
    });

    if (!existingProduct) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

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

    const nextType =
      type === "RETAIL" ||
      type === "WHOLESALE" ||
      type === "BOTH"
        ? type
        : existingProduct.type;

    const nextFeatured =
      typeof featured === "boolean"
        ? featured
        : existingProduct.featured;

    if (
      nextFeatured &&
      nextType === "WHOLESALE" &&
      !existingProduct.featured
    ) {
      const featuredWholesaleCount = await db.product.count({
        where: {
          type: "WHOLESALE",
          featured: true,
          NOT: {
            id,
          },
        },
      });

      if (
        featuredWholesaleCount >=
        MAX_WHOLESALE_FEATURED_PRODUCTS
      ) {
        return NextResponse.json(
          {
            error:
              "Only six wholesale products may be featured at one time. Unfeature another wholesale product first.",
          },
          { status: 400 }
        );
      }
    }

    const product = await db.$transaction(async (transaction) => {
      await transaction.productVariant.deleteMany({
        where: {
          productId: id,
        },
      });

      return transaction.product.update({
        where: {
          id,
        },
        data: {
          name,
          description,
          category,
          subcategory,
          type: nextType,
          images: Array.isArray(images) ? images : [],
          active:
            typeof active === "boolean"
              ? active
              : true,
          featured: nextFeatured,
          metadata: metadata || {},
          variants: {
            create:
              variants?.map((variant: any) => ({
                label: variant.label,
                price: Number(variant.price),
                compareAt:
                  variant.compareAt !== null &&
                  variant.compareAt !== undefined &&
                  variant.compareAt !== ""
                    ? Number(variant.compareAt)
                    : null,
                sku: variant.sku || null,
                qty: Number(variant.qty || 0),
                inStock:
                  typeof variant.inStock === "boolean"
                    ? variant.inStock
                    : true,
                images: Array.isArray(variant.images)
                  ? variant.images
                  : [],
                stripePriceId:
                  variant.stripePriceId || null,
                metadata: variant.metadata || {},
              })) || [],
          },
        },
        include: {
          variants: {
            orderBy: {
              price: "asc",
            },
          },
        },
      });
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
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;

    const product = await db.product.findUnique({
      where: {
        id,
      },
      select: {
        id: true,
      },
    });

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    await db.product.delete({
      where: {
        id,
      },
    });

    return NextResponse.json({
      success: true,
    });
  } catch (error) {
    console.error("Delete product error:", error);

    return NextResponse.json(
      { error: "Failed to delete product." },
      { status: 500 }
    );
  }
}
