import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { stripe } from "@/lib/stripe";
import { resend, FROM_EMAIL } from "@/lib/resend";
import RetreatGuestRemovalEmail from "@/emails/RetreatGuestRemovalEmail";

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    if (!stripe) {
      return NextResponse.json(
        { error: "Stripe is not configured." },
        { status: 500 }
      );
    }

    const { id } = await params;
    const body = await req.json();

    const reason = String(body.reason || "").trim();

    if (!reason) {
      return NextResponse.json(
        { error: "Removal reason is required." },
        { status: 400 }
      );
    }

    const guest = await db.retreatGuest.findUnique({
      where: { id },
      include: {
        retreat: true,
        order: {
          include: {
            items: true,
          },
        },
        orderItem: true,
      },
    });

    if (!guest) {
      return NextResponse.json(
        { error: "Guest not found." },
        { status: 404 }
      );
    }

    if (!guest.order?.stripeSessionId) {
      return NextResponse.json(
        { error: "No Stripe session found for this guest/order." },
        { status: 400 }
      );
    }

    if (guest.status === "REMOVED_REFUNDED") {
      return NextResponse.json(
        { error: "This guest has already been removed/refunded." },
        { status: 400 }
      );
    }

    const session = await stripe.checkout.sessions.retrieve(
      guest.order.stripeSessionId
    );

    const paymentIntent =
      typeof session.payment_intent === "string"
        ? session.payment_intent
        : session.payment_intent?.id;

    if (!paymentIntent) {
      return NextResponse.json(
        { error: "No Stripe payment intent found for this order." },
        { status: 400 }
      );
    }

    const guestQty = guest.orderItem?.qty || 1;
    const guestPrice = guest.orderItem?.price || guest.order?.total || 0;
    const refundAmount = Math.round((guestPrice / guestQty) * 100);

    const refund = await stripe.refunds.create({
      payment_intent: paymentIntent,
      amount: refundAmount,
      metadata: {
        retreatGuestId: guest.id,
        orderId: guest.orderId || "",
        retreatId: guest.retreatId || "",
        reason,
      },
    });

    await db.retreatGuest.update({
      where: { id: guest.id },
      data: {
        status: "REMOVED_REFUNDED",
        adminNotes: [
          guest.adminNotes || "",
          "",
          `Removed guest reason: ${reason}`,
          `Stripe refund ID: ${refund.id}`,
        ]
          .filter(Boolean)
          .join("\n"),
      },
    });

    if (guest.retreatId) {
      await db.retreat.update({
        where: { id: guest.retreatId },
        data: {
          spotsLeft: {
            increment: 1,
          },
          inStock: true,
        },
      });
    }

    if (resend && guest.email) {
      await resend.emails.send({
        from: FROM_EMAIL,
        to: guest.email,
        subject: "Your Herbal Communities Retreat Booking Has Been Refunded",
        react: RetreatGuestRemovalEmail({
          guestName: guest.name,
          retreatName: guest.retreat?.name,
          reason,
        }),
      });
    }

    return NextResponse.json({
      success: true,
      refundId: refund.id,
    });
  } catch (error: any) {
    console.error("Remove retreat guest error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to remove guest." },
      { status: 500 }
    );
  }
}
