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

  const retreats = await db.retreat.findMany({
    orderBy: {
      createdAt: "desc",
    },
  });

  return NextResponse.json(retreats);
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
      location,
      country,
      duration,
      price,
      spots,
      spotsLeft,
      images,
      featured,
      startDate,
      endDate,
      includes,
      metadata,
      active,
    } = body;

    if (!name || !price) {
      return NextResponse.json(
        { error: "Name and price are required." },
        { status: 400 }
      );
    }

    const baseSlug = slugify(name);
    let slug = baseSlug;
    let count = 1;

    while (await db.retreat.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${count}`;
      count++;
    }

    const retreat = await db.retreat.create({
      data: {
        name,
        slug,
        description,
        location,
        country,
        duration,
        price: Number(price),
        spots: Number(spots || 0),
        spotsLeft: Number(spotsLeft || spots || 0),
        images: Array.isArray(images) ? images : [],
        featured: featured ?? false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        includes: Array.isArray(includes) ? includes : [],
        metadata: metadata || {},
        active: active ?? true,
        inStock: Number(spotsLeft || spots || 0) > 0,
      },
    });

    return NextResponse.json(retreat);
  } catch (error) {
    console.error("Create retreat error:", error);

    return NextResponse.json(
      { error: "Failed to create retreat." },
      { status: 500 }
    );
  }
}
