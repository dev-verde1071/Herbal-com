import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { db } from "@/lib/db";
import { getOrCreateDbUser } from "@/lib/currentUser";

async function getOrCreateCart(userId: string) {
  let cart = await db.cart.findFirst({
    where: { userId },
    include: {
      items: {
        include: {
          product: true,
          variant: true,
          retreat: true,
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
            retreat: true,
          },
        },
      },
    });
  }

  return cart;
}

function getRetreatPrice(retreat: any) {
  if (retreat.clearanceActive) {
    if (retreat.clearancePrice && retreat.clearancePrice > 0) {
      return retreat.clearancePrice;
    }

    if (retreat.clearancePercent && retreat.clearancePercent > 0) {
      const discount = retreat.price * (retreat.clearancePercent / 100);
      return Math.max(0, retreat.price - discount);
    }
  }

  return retreat.price;
}

function mapCartItems(cart: any) {
  return cart.items.map((item: any) => {
    if (item.retreat) {
      return {
        id: item.id,
        itemType: "RETREAT",
        retreatId: item.retreatId,
        productId: null,
        variantId: null,
        name: item.retreat.name,
        variantLabel: item.retreat.duration || "Retreat Booking",
        price: getRetreatPrice(item.retreat),
        originalPrice: item.retreat.price,
        image: item.retreat.images?.[0] || null,
        qty: item.qty,
        productType: "RETREAT",
        slug: item.retreat.slug,
        spotsLeft: item.retreat.spotsLeft,
      };
    }

    return {
      id: item.id,
      itemType: "PRODUCT",
      productId: item.productId,
      variantId: item.variantId,
      retreatId: null,
      name: item.product.name,
      variantLabel: item.variant.label,
      price: item.variant.price,
      image: item.variant.images?.[0] || item.product.images?.[0] || null,
      qty: item.qty,
      productType: item.product.type,
      slug: item.product.slug,
    };
  });
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ items: [] });
  }

  const dbUser = await getOrCreateDbUser();

  if (!dbUser) {
    return NextResponse.json({ items: [] });
  }

  const cart = await getOrCreateCart(dbUser.id);

  return NextResponse.json({
    items: mapCartItems(cart),
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
    const dbUser = await getOrCreateDbUser();

    if (!dbUser) {
      return NextResponse.json(
        { error: "Unable to identify customer account." },
        { status: 401 }
      );
    }

    const body = await req.json();

    const productId = body.productId ? String(body.productId) : "";
    const variantId = body.variantId ? String(body.variantId) : "";
    const retreatId = body.retreatId ? String(body.retreatId) : "";
    const qty = Math.max(1, Number(body.qty || 1));

    if (!retreatId && (!productId || !variantId)) {
      return NextResponse.json(
        { error: "Missing product, variant, or retreat." },
        { status: 400 }
      );
    }

    const cart = await getOrCreateCart(dbUser.id);

    if (retreatId) {
      const retreat = await db.retreat.findUnique({
        where: { id: retreatId },
      });

      if (!retreat || !retreat.active || !retreat.inStock) {
        return NextResponse.json(
          { error: "This retreat is unavailable." },
          { status: 400 }
        );
      }

      if (retreat.spotsLeft <= 0) {
        return NextResponse.json(
          { error: "This trip is fully booked." },
          { status: 400 }
        );
      }

      const existing = await db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          retreatId,
        },
      });

      if (existing) {
        await db.cartItem.update({
          where: { id: existing.id },
          data: {
            qty: Math.min(existing.qty + qty, retreat.spotsLeft),
          },
        });
      } else {
        await db.cartItem.create({
          data: {
            cartId: cart.id,
            retreatId,
            qty: Math.min(qty, retreat.spotsLeft),
          },
        });
      }

      const updated = await getOrCreateCart(dbUser.id);

      return NextResponse.json({
        success: true,
        items: mapCartItems(updated),
      });
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

    const updated = await getOrCreateCart(dbUser.id);

    return NextResponse.json({
      success: true,
      items: mapCartItems(updated),
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
    const dbUser = await getOrCreateDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const variantId = body.variantId ? String(body.variantId) : "";
    const retreatId = body.retreatId ? String(body.retreatId) : "";
    const qty = Math.max(1, Number(body.qty || 1));

    const cart = await getOrCreateCart(dbUser.id);

    if (retreatId) {
      const item = await db.cartItem.findFirst({
        where: {
          cartId: cart.id,
          retreatId,
        },
      });

      if (!item) {
        return NextResponse.json(
          { error: "Cart item not found." },
          { status: 404 }
        );
      }

      const retreat = await db.retreat.findUnique({
        where: {
          id: retreatId,
        },
      });

      await db.cartItem.update({
        where: { id: item.id },
        data: {
          qty: retreat ? Math.min(qty, retreat.spotsLeft) : qty,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (!variantId) {
      return NextResponse.json({ error: "Missing item." }, { status: 400 });
    }

    const item = await db.cartItem.findUnique({
      where: {
        cartId_variantId: {
          cartId: cart.id,
          variantId,
        },
      },
    });

    if (!item) {
      return NextResponse.json(
        { error: "Cart item not found." },
        { status: 404 }
      );
    }

    const variant = await db.productVariant.findUnique({
      where: {
        id: variantId,
      },
    });

    await db.cartItem.update({
      where: { id: item.id },
      data: {
        qty: variant ? Math.min(qty, variant.qty) : qty,
      },
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
    const dbUser = await getOrCreateDbUser();

    if (!dbUser) {
      return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
    }

    const body = await req.json();

    const variantId = body.variantId ? String(body.variantId) : "";
    const retreatId = body.retreatId ? String(body.retreatId) : "";
    const clear = Boolean(body.clear);

    const cart = await getOrCreateCart(dbUser.id);

    if (clear) {
      await db.cartItem.deleteMany({
        where: {
          cartId: cart.id,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (retreatId) {
      await db.cartItem.deleteMany({
        where: {
          cartId: cart.id,
          retreatId,
        },
      });

      return NextResponse.json({ success: true });
    }

    if (!variantId) {
      return NextResponse.json({ error: "Missing item." }, { status: 400 });
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
