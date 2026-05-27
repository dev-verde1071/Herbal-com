import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function GET() {
  try {
    const banner = await db.banner.findFirst({
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(banner);
  } catch {
    return NextResponse.json(null);
  }
}

export async function POST(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const banner = await db.banner.create({
    data: {
      text: body.text || "Welcome to Herbal Communities",
      active: body.active ?? true,
      color: body.color || "#c89f4f",
      bgColor: body.bgColor || "#1a3a22",
      emoji: body.emoji || "🌿",
      speedSeconds: Number(body.speedSeconds || 90),
    },
  });

  return NextResponse.json(banner);
}

export async function PUT(req: Request) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();

  const banner = await db.banner.update({
    where: { id: body.id },
    data: {
      text: body.text,
      active: body.active,
      color: body.color,
      bgColor: body.bgColor,
      emoji: body.emoji || "🌿",
      speedSeconds: Number(body.speedSeconds || 90),
    },
  });

  return NextResponse.json(banner);
}
