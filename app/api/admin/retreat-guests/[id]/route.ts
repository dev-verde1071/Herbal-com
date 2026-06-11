import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";

export async function PUT(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const guest = await db.retreatGuest.update({
      where: {
        id,
      },
      data: {
        name: String(body.name || "").trim(),
        email: body.email ? String(body.email).trim() : null,
        phone: body.phone ? String(body.phone).trim() : null,
        emergencyContact: body.emergencyContact
          ? String(body.emergencyContact).trim()
          : null,
        emergencyPhone: body.emergencyPhone
          ? String(body.emergencyPhone).trim()
          : null,
        dietaryRestrictions: body.dietaryRestrictions
          ? String(body.dietaryRestrictions).trim()
          : null,
        medicalNotes: body.medicalNotes
          ? String(body.medicalNotes).trim()
          : null,
        travelNotes: body.travelNotes
          ? String(body.travelNotes).trim()
          : null,
        adminNotes: body.adminNotes ? String(body.adminNotes).trim() : null,
        status: body.status ? String(body.status).trim() : "BOOKED",
      },
    });

    return NextResponse.json({
      success: true,
      guest,
    });
  } catch (error: any) {
    console.error("Update retreat guest error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update retreat guest." },
      { status: 500 }
    );
  }
}
