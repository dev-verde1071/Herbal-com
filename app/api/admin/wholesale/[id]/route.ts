import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WholesaleApproved from "@/emails/WholesaleApproved";
import WholesaleRejected from "@/emails/WholesaleRejected";

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
    const status = body.status;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    if (!resend) {
      return NextResponse.json(
        { error: "Resend is not configured. Check RESEND_API_KEY in Render." },
        { status: 500 }
      );
    }

    const application = await db.wholesaleApplication.update({
      where: { id },
      data: {
        status,
        adminNote: body.adminNote || null,
      },
    });

    const emailResult =
      status === "APPROVED"
        ? await resend.emails.send({
            from: FROM_EMAIL,
            to: application.email,
            subject: "Wholesale Access Approved - Herbal Communities",
            react: WholesaleApproved({
              name: application.name,
              businessName: application.business,
              siteUrl:
                process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
            }),
          })
        : await resend.emails.send({
            from: FROM_EMAIL,
            to: application.email,
            subject: "Wholesale Application Update - Herbal Communities",
            react: WholesaleRejected({
              name: application.name,
              businessName: application.business,
            }),
          });

    if (emailResult.error) {
      console.error("Resend error:", emailResult.error);

      return NextResponse.json(
        {
          error: "Application status updated, but email failed.",
          resendError: emailResult.error,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      application,
      emailId: emailResult.data?.id,
    });
  } catch (error: any) {
    console.error("Wholesale email route error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update application." },
      { status: 500 }
    );
  }
}
