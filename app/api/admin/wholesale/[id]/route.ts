import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdmin } from "@/lib/auth";
import { resend, FROM_EMAIL } from "@/lib/resend";
import WholesaleApproved from "@/emails/WholesaleApproved";

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
      status,
      adminNote,
    } = body;

    const application = await db.wholesaleApplication.update({
      where: { id },
      data: {
        status,
        adminNote,
      },
    });

    if (status === "APPROVED") {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: application.email,
          subject: "Wholesale Access Approved",
          react: WholesaleApproved({
            name: application.name,
            businessName: application.business,
            siteUrl:
              process.env.NEXT_PUBLIC_SITE_URL ||
              "http://localhost:3000",
          }),
        });
      } catch (emailError) {
        console.error("Approval email error:", emailError);
      }
    }

    return NextResponse.json(application);
  } catch (error) {
    console.error("Wholesale approval error:", error);

    return NextResponse.json(
      { error: "Failed to update application." },
      { status: 500 }
    );
  }
}
