import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

async function getOrCreateCart(userId: string) {
  let cart = await db.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
        },
      },
    },
  });

  if (!cart) {
    cart = await db.cart.create({
      data: {
        userId,
      },
      include: {
        items: {
          include: {
            product: true,
            variant: true,
          },
        },
      },
    });
  }

  return cart;
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const cart = await getOrCreateCart(userId);

  return NextResponse.json({
    items: cart.items.map((item) => ({
      id: item.id,
      productId: item.productId,
      variantId: item.variantId,
      name: item.product.name,
      variantLabel: item.variant.label,
      price: item.variant.price,
      image: item.variant.images?.[0] || item.product.images?.[0] || null,
      qty: item.qty,
      productType: item.product.type,
      slug: item.product.slug,
    })),
  });
}

export async function POST(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Please sign in to save items to your cart." },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const productId = String(body.productId || "");
    const variantId = String(body.variantId || "");
    const qty = Math.max(1, Number(body.qty || 1));

    if (!productId || !variantId) {
      return NextResponse.json(
        { error: "Missing product or variant." },
        { status: 400 }
      );
    }

    const variant = await db.productVariant.findUnique({
      where: { id: variantId },
      include: { product: true },
    });

    if (!variant || !variant.product || !variant.inStock || variant.qty <= 0) {
      return NextResponse.json(
        { error: "This item is unavailable." },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(userId);

    const existing = await db.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (existing) {
      await db.cartItem.update({
        where: { id: existing.id },
        data: {
          qty: Math.min(existing.qty + qty, variant.qty),
        },
      });
    } else {
      await db.cartItem.create({
        data: {
          cartId: cart.id,
          productId,
          variantId,
          qty: Math.min(qty, variant.qty),
        },
      });
    }

    const updated = await getOrCreateCart(userId);

    return NextResponse.json({
      success: true,
      items: updated.items.map((item) => ({
        id: item.id,
        productId: item.productId,
        variantId: item.variantId,
        name: item.product.name,
        variantLabel: item.variant.label,
        price: item.variant.price,
        image: item.variant.images?.[0] || item.product.images?.[0] || null,
        qty: item.qty,
        productType: item.product.type,
        slug: item.product.slug,
      })),
    });
  } catch (error) {
    console.error("Cart POST error:", error);

    return NextResponse.json(
      { error: "Failed to update cart." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variantId = String(body.variantId || "");
    const qty = Math.max(1, Number(body.qty || 1));

    const cart = await getOrCreateCart(userId);

    const item = await db.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (!item) {
      return NextResponse.json({ error: "Cart item not found." }, { status: 404 });
    }

    await db.cartItem.update({
      where: { id: item.id },
      data: { qty },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update cart." },
      { status: 500 }
    );
  }
}

export async function DELETE(req: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();

    const variantId = body.variantId ? String(body.variantId) : null;
    const clear = Boolean(body.clear);

    const cart = await getOrCreateCart(userId);

    if (clear) {
      await db.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (!variantId) {
      return NextResponse.json({ error: "Missing variant." }, { status: 400 });
    }

    await db.cartItem.deleteMany({
      where: {
        cartId: cart.id,
        variantId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Cart DELETE error:", error);

    return NextResponse.json(
      { error: "Failed to delete cart item." },
      { status: 500 }
    );
  }
}
