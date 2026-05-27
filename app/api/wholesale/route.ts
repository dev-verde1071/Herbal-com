import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL, ADMIN_NOTIFICATION_EMAIL } from "@/lib/resend";
import WholesaleReceived from "@/emails/WholesaleReceived";
import WholesaleApplicationConfirmation from "@/emails/WholesaleApplicationConfirmation";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const name = String(body.name || "").trim();
    const business = String(body.business || "").trim();
    const email = String(body.email || "").trim();
    const phone = String(body.phone || "").trim();
    const message = String(body.message || "").trim();

    if (!name || !business || !email || !phone) {
      return NextResponse.json(
        { error: "Name, business, email, and phone are required." },
        { status: 400 }
      );
    }

    const application = await db.wholesaleApplication.create({
      data: {
        name,
        business,
        email,
        phone,
        message,
        status: "PENDING",
      },
    });

    if (resend) {
      try {
        if (ADMIN_NOTIFICATION_EMAIL) {
          await resend.emails.send({
            from: FROM_EMAIL,
            to: ADMIN_NOTIFICATION_EMAIL,
            subject: "New Wholesale Application - Herbal Communities",
            react: WholesaleReceived({
              name,
              businessName: business,
              email,
              phone,
              message,
            }),
          });
        }

        await resend.emails.send({
          from: FROM_EMAIL,
          to: email,
          subject: "Wholesale Application Received - Herbal Communities",
          react: WholesaleApplicationConfirmation({
            name,
            businessName: business,
          }),
        });
      } catch (emailError) {
        console.error("Wholesale email error:", emailError);
      }
    }

    return NextResponse.json({ success: true, application });
  } catch (error) {
    console.error("Wholesale API error:", error);

    return NextResponse.json(
      { error: "Failed to submit wholesale application." },
      { status: 500 }
    );
  }
}
