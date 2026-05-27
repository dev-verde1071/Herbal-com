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
    return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const body = await req.json();

    const { status, adminNote } = body;

    const application = await db.wholesaleApplication.update({
      where: { id },
      data: {
        status,
        adminNote,
      },
    });

    if (resend && status === "APPROVED") {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: application.email,
          subject: "Wholesale Access Approved - Herbal Communities",
          react: WholesaleApproved({
            name: application.name,
            businessName: application.business,
            siteUrl:
              process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
          }),
        });
      } catch (emailError) {
        console.error("Approval email error:", emailError);
      }
    }

    if (resend && status === "REJECTED") {
      try {
        await resend.emails.send({
          from: FROM_EMAIL,
          to: application.email,
          subject: "Wholesale Application Update - Herbal Communities",
          html: `
            <div style="font-family: Arial, sans-serif; background:#071510; color:#ffffff; padding:32px;">
              <h1>Wholesale Application Update</h1>
              <p>Hi ${application.name},</p>
              <p>Thank you for applying for wholesale access with Herbal Communities.</p>
              <p>At this time, your application was not approved.</p>
              ${
                adminNote
                  ? `<p><strong>Note:</strong> ${adminNote}</p>`
                  : ""
              }
              <p>You may contact us if you have questions or would like to apply again later.</p>
            </div>
          `,
        });
      } catch (emailError) {
        console.error("Rejection email error:", emailError);
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
