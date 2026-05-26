import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

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

  const retreat = await db.retreat.findUnique({
    where: { id },
  });

  if (!retreat) {
    return NextResponse.json(
      { error: "Retreat not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(retreat);
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

    const retreat = await db.retreat.update({
      where: { id },
      data: {
        name,
        description,
        location,
        country,
        duration,
        price: Number(price),
        spots: Number(spots || 0),
        spotsLeft: Number(spotsLeft || 0),
        images: Array.isArray(images) ? images : [],
        featured: featured ?? false,
        startDate: startDate ? new Date(startDate) : null,
        endDate: endDate ? new Date(endDate) : null,
        includes: Array.isArray(includes) ? includes : [],
        metadata: metadata || {},
        active: active ?? true,
        inStock: Number(spotsLeft || 0) > 0,
      },
    });

    return NextResponse.json(retreat);
  } catch (error) {
    console.error("Update retreat error:", error);

    return NextResponse.json(
      { error: "Failed to update retreat." },
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

    await db.retreat.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Delete retreat error:", error);

    return NextResponse.json(
      { error: "Failed to delete retreat." },
      { status: 500 }
    );
  }
}
