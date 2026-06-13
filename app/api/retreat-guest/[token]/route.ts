import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend } from "@/lib/resend";
import { RETREATS_FROM_EMAIL } from "@/lib/emailFrom";
import RetreatGuestIntakeSubmittedEmail from "@/emails/RetreatGuestIntakeSubmittedEmail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params;
    const body = await req.json();

    const guest = await db.retreatGuest.findFirst({
      where: {
        intakeToken: token,
      },
      include: {
        retreat: true,
      },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Guest intake record not found." },
        { status: 404 }
      );
    }

    const name = String(body.name || "").trim();
    const phone = String(body.phone || "").trim();
    const emergencyContact = String(body.emergencyContact || "").trim();
    const emergencyPhone = String(body.emergencyPhone || "").trim();
    const nearestAirportName = String(body.nearestAirportName || "").trim();
    const nearestAirportCode = String(body.nearestAirportCode || "")
      .trim()
      .toUpperCase();

    if (
      !name ||
      !phone ||
      !emergencyContact ||
      !emergencyPhone ||
      !nearestAirportName ||
      !nearestAirportCode
    ) {
      return NextResponse.json(
        {
          error:
            "Name, phone, emergency contact, emergency phone, nearest airport, and airport code are required.",
        },
        { status: 400 }
      );
    }

    const updatedGuest = await db.retreatGuest.update({
      where: {
        id: guest.id,
      },
      data: {
        name,
        phone,
        emergencyContact,
        emergencyPhone,
        nearestAirportName,
        nearestAirportCode,
        dietaryRestrictions: body.dietaryRestrictions
          ? String(body.dietaryRestrictions).trim()
          : null,
        medicalNotes: body.medicalNotes
          ? String(body.medicalNotes).trim()
          : null,
        travelNotes: body.travelNotes ? String(body.travelNotes).trim() : null,
        intakeSubmitted: true,
        intakeSubmittedAt: new Date(),
        status: "INTAKE_SUBMITTED",
      },
    });

    if (resend && updatedGuest.email) {
      await resend.emails.send({
        from: RETREATS_FROM_EMAIL,
        to: updatedGuest.email,
        subject: "Your Herbal Communities Guest Information Was Submitted",
        react: RetreatGuestIntakeSubmittedEmail({
          guestName: updatedGuest.name,
          retreatName: guest.retreat?.name,
        }),
      });
    }

    return NextResponse.json({
      success: true,
    });
  } catch (error: any) {
    console.error("Retreat guest intake submit error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to submit guest information." },
      { status: 500 }
    );
  }
}
