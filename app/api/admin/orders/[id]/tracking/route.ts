import { NextResponse } from "next/server";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { resend, FROM_EMAIL } from "@/lib/resend";
import TrackingEmail from "@/emails/TrackingEmail";
import TrackingCorrectionEmail from "@/emails/TrackingCorrectionEmail";

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

    const trackingNumber = String(body.trackingNumber || "").trim();
    const trackingCourier = String(body.trackingCourier || "").trim();

    if (!trackingNumber || !trackingCourier) {
      return NextResponse.json(
        { error: "Tracking number and courier are required." },
        { status: 400 }
      );
    }

    const existingOrder = await db.order.findUnique({
      where: { id },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { error: "Order not found." },
        { status: 404 }
      );
    }

    const wasEdited = Boolean(existingOrder.trackingNumber);

    const order = await db.order.update({
      where: { id },
      data: {
        trackingNumber,
        trackingCourier,
        trackingEdited: wasEdited,
        shippingStatus: "TRACKING_ADDED",
      },
    });

    if (resend && order.email) {
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: order.email,
        subject: wasEdited
          ? "Updated Tracking Information - Herbal Communities"
          : "Your Herbal Communities Order Is On The Way",
        react: wasEdited
          ? TrackingCorrectionEmail({
              customerName: order.shippingName,
              trackingNumber,
              trackingCourier,
              orderId: order.id,
            })
          : TrackingEmail({
              customerName: order.shippingName,
              trackingNumber,
              trackingCourier,
              orderId: order.id,
            }),
      });

      if (emailResult.error) {
        return NextResponse.json(
          {
            error: "Tracking saved, but email failed.",
            resendError: emailResult.error,
            order,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      success: true,
      order,
    });
  } catch (error: any) {
    console.error("Tracking update error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update tracking." },
      { status: 500 }
    );
  }
}
