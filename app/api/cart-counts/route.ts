import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  const productCounts = await db.cartItem.groupBy({
    by: ["variantId"],
    where: {
      variantId: {
        not: null,
      },
    },
    _sum: {
      qty: true,
    },
  });

  const retreatCounts = await db.cartItem.groupBy({
    by: ["retreatId"],
    where: {
      retreatId: {
        not: null,
      },
    },
    _sum: {
      qty: true,
    },
  });

  return NextResponse.json({
    variants: productCounts.reduce((acc: Record<string, number>, item) => {
      if (item.variantId) acc[item.variantId] = item._sum.qty || 0;
      return acc;
    }, {}),
    retreats: retreatCounts.reduce((acc: Record<string, number>, item) => {
      if (item.retreatId) acc[item.retreatId] = item._sum.qty || 0;
      return acc;
    }, {}),
  });
}
