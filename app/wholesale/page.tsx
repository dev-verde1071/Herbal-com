export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WholesaleAccessPanel from "./WholesaleAccessPanel";

export default async function WholesalePage() {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (email) {
      const approvedApplication = await db.wholesaleApplication.findFirst({
        where: {
          OR: [
            {
              userId,
            },
            {
              email,
            },
          ],
          status: "APPROVED",
          archived: false,
        },
        orderBy: {
          createdAt: "desc",
        },
      });

      if (approvedApplication) {
        if (!approvedApplication.userId) {
          await db.wholesaleApplication.update({
            where: {
              id: approvedApplication.id,
            },
            data: {
              userId,
            },
          });
        }

        redirect("/dashboard/wholesale");
      }
    }
  }

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              Wholesale Program
            </p>

            <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              Bulk Herbal Partnerships
            </h1>

            <p className="text-zinc-300 leading-relaxed text-lg mb-10">
              Apply for wholesale access to premium herbal products, sea moss,
              stingless bee honey, oils, and wellness goods sourced directly
              from trusted communities.
            </p>

            <div className="glass rounded-3xl p-8 border border-jungle-900/60 mb-6">
              <h2 className="text-xl font-semibold text-jungle-300 mb-5">
                Wholesale Benefits
              </h2>

              <div className="space-y-4 text-zinc-300">
                <p>• Bulk pricing discounts</p>
                <p>• Private labeling opportunities</p>
                <p>• Access to limited inventory</p>
                <p>• Large quantity sea moss ordering</p>
                <p>• Melipona honey wholesale access</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border border-jungle-900/60">
              <h2 className="text-xl font-semibold text-jungle-300 mb-5">
                How It Works
              </h2>

              <div className="space-y-4 text-zinc-300">
                <p>1. Create an account or sign in.</p>
                <p>2. Submit your wholesale application.</p>
                <p>3. Our team reviews your request.</p>
                <p>4. If approved, you receive wholesale access.</p>
                <p>5. A team member follows up by email and/or phone.</p>
              </div>
            </div>
          </div>

          <WholesaleAccessPanel />
        </div>
      </div>
    </div>
  );
}
