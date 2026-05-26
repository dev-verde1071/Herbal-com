import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const banner = await db.banner.findFirst({
      orderBy: {
        createdAt: "desc",
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner GET error:", error);

    return NextResponse.json(
      { error: "Failed to fetch banner." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      text,
      active,
      color,
      bgColor,
    } = body;

    const banner = await db.banner.create({
      data: {
        text,
        active: active ?? true,
        color: color || "#c89f4f",
        bgColor: bgColor || "#1a3a22",
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner POST error:", error);

    return NextResponse.json(
      { error: "Failed to create banner." },
      { status: 500 }
    );
  }
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 }
    );
  }

  try {
    const body = await req.json();

    const {
      id,
      text,
      active,
      color,
      bgColor,
    } = body;

    const banner = await db.banner.update({
      where: { id },
      data: {
        text,
        active,
        color,
        bgColor,
      },
    });

    return NextResponse.json(banner);
  } catch (error) {
    console.error("Banner PUT error:", error);

    return NextResponse.json(
      { error: "Failed to update banner." },
      { status: 500 }
    );
  }
}
