import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const body = await req.json();

    const name = String(body.name || "").trim();

    if (!name) {
      return NextResponse.json(
        { error: "Retreat name is required." },
        { status: 400 }
      );
    }

    const slug = body.slug ? slugify(String(body.slug)) : slugify(name);

    const retreat = await db.retreat.create({
      data: {
        name,
        slug,
        description: body.description || null,
        location: body.location || null,
        country: body.country || null,
        duration: body.duration || null,
        price: Number(body.price || 0),
        compareAt: body.compareAt ? Number(body.compareAt) : null,
        clearanceActive: Boolean(body.clearanceActive),
        clearancePercent: body.clearancePercent
          ? Number(body.clearancePercent)
          : null,
        clearancePrice: body.clearancePrice
          ? Number(body.clearancePrice)
          : null,
        spots: Number(body.spots || 0),
        spotsLeft: Number(body.spotsLeft || 0),
        inStock: Boolean(body.inStock),
        images: Array.isArray(body.images) ? body.images : [],
        videos: Array.isArray(body.videos) ? body.videos : [],
        featured: Boolean(body.featured),
        startDate: body.startDate ? new Date(body.startDate) : null,
        endDate: body.endDate ? new Date(body.endDate) : null,
        includes: Array.isArray(body.includes) ? body.includes : [],
        active: body.active ?? true,
      },
    });

    return NextResponse.json({
      success: true,
      retreat,
    });
  } catch (error: any) {
    console.error("Create retreat error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to create retreat." },
      { status: 500 }
    );
  }
}
