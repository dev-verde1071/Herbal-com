export const dynamic = "force-dynamic";

import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import WholesaleAccessPanel from "./WholesaleAccessPanel";
import WholesaleFeaturedProducts from "./WholesaleFeaturedProducts";

export default async function WholesalePage() {
  const { userId } = await auth();

  if (userId) {
    const user = await currentUser();
    const email = user?.emailAddresses?.[0]?.emailAddress;

    if (email) {
      const approvedApplication =
        await db.wholesaleApplication.findFirst({
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

  const featuredProducts = await db.product.findMany({
    where: {
      type: "WHOLESALE",
      featured: true,
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: {
      updatedAt: "desc",
    },
    take: 6,
  });

  return (
    <div className="min-h-screen px-6 py-16">
      <div className="mx-auto max-w-6xl">
        <div className="grid items-start gap-12 lg:grid-cols-2">
          <div>
            <p className="mb-4 text-xs uppercase tracking-[0.3em] text-jungle-300">
              Wholesale Program
            </p>

            <h1 className="mb-6 font-display text-5xl leading-tight md:text-6xl">
              Bulk Herbal Partnerships
            </h1>

            <p className="mb-10 text-lg leading-relaxed text-zinc-300">
              Apply for wholesale access to premium herbal products, sea moss,
              stingless bee honey, oils, and wellness goods sourced directly
              from trusted communities.
            </p>

            <div className="glass mb-6 rounded-3xl border border-jungle-900/60 p-8">
              <h2 className="mb-5 text-xl font-semibold text-jungle-300">
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

            <div className="glass rounded-3xl border border-jungle-900/60 p-8">
              <h2 className="mb-5 text-xl font-semibold text-jungle-300">
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

          <div className="space-y-8">
            <WholesaleAccessPanel />

            <WholesaleFeaturedProducts
              products={featuredProducts as any[]}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
