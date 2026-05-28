export const dynamic = "force-dynamic";

import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

export default async function WholesaleDashboardPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const email = user?.emailAddresses?.[0]?.emailAddress;

  if (!email) {
    redirect("/wholesale");
  }

  const application = await db.wholesaleApplication.findFirst({
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

  if (!application) {
    return (
      <div className="min-h-screen py-16 px-6">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-10 border border-jungle-900/60 text-center">
          <p className="text-5xl mb-6">🌿</p>

          <h1 className="font-display text-4xl mb-4">
            Wholesale Access Pending
          </h1>

          <p className="text-zinc-300 leading-relaxed mb-8">
            Your account does not currently have approved wholesale access.
            Please submit a wholesale application or wait for approval from the
            Herbal Communities team.
          </p>

          <Link
            href="/wholesale"
            className="inline-flex items-center gap-2 rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-8 py-4 font-semibold transition"
          >
            Apply for Wholesale
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    );
  }

  if (!application.userId) {
    await db.wholesaleApplication.update({
      where: {
        id: application.id,
      },
      data: {
        userId,
      },
    });
  }

  const products = await db.product.findMany({
    where: {
      active: true,
      type: "WHOLESALE",
    },
    include: {
      variants: {
        orderBy: {
          price: "asc",
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Wholesale Access Approved
          </p>

          <h1 className="font-display text-5xl">
            Wholesale Products
          </h1>

          <p className="text-zinc-400 mt-3 max-w-2xl">
            Welcome, {application.name}. Browse wholesale-only products and
            pricing available to approved Herbal Communities partners.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-jungle-900/60 text-zinc-400">
            No wholesale products are available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
