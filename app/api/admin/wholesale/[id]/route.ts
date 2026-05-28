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

    if (typeof body.archived === "boolean") {
      const application = await db.wholesaleApplication.update({
        where: { id },
        data: {
          archived: body.archived,
        },
      });

      return NextResponse.json({ success: true, application });
    }

    if (typeof body.outreachNeeded === "boolean") {
      const application = await db.wholesaleApplication.update({
        where: { id },
        data: {
          outreachNeeded: body.outreachNeeded,
        },
      });

      return NextResponse.json({ success: true, application });
    }

    const status = body.status;

    if (!["APPROVED", "REJECTED"].includes(status)) {
      return NextResponse.json({ error: "Invalid status." }, { status: 400 });
    }

    const application = await db.wholesaleApplication.update({
      where: { id },
      data: {
        status,
        adminNote: body.adminNote || null,
        outreachNeeded: status === "APPROVED",
      },
    });

    if (resend && status === "APPROVED") {
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: application.email,
        subject: "Wholesale Access Approved - Herbal Communities",
        react: WholesaleApproved({
          name: application.name,
          businessName: application.business,
          siteUrl: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
        }),
      });

      if (emailResult.error) {
        return NextResponse.json(
          {
            error: "Application approved, but approval email failed.",
            resendError: emailResult.error,
          },
          { status: 500 }
        );
      }
    }

    if (resend && status === "REJECTED") {
      const emailResult = await resend.emails.send({
        from: FROM_EMAIL,
        to: application.email,
        subject: "Wholesale Application Update - Herbal Communities",
        react: WholesaleRejected({
          name: application.name,
          businessName: application.business,
        }),
      });

      if (emailResult.error) {
        return NextResponse.json(
          {
            error: "Application rejected, but rejection email failed.",
            resendError: emailResult.error,
          },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({ success: true, application });
  } catch (error: any) {
    console.error("Wholesale application update error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to update application." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdmin())) {
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;

    await db.wholesaleApplication.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error("Wholesale application delete error:", error);

    return NextResponse.json(
      { error: error.message || "Failed to delete application." },
      { status: 500 }
    );
  }
}
