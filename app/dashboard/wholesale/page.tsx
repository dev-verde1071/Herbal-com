import { redirect } from "next/navigation";
import { getCurrentDbUser, syncUser } from "@/lib/auth";
import { db } from "@/lib/db";
import WholesaleOrderButton from "./WholesaleOrderButton";
import { formatPrice } from "@/lib/utils";

export default async function WholesaleDashboardPage() {
  await syncUser();

  const user = await getCurrentDbUser();

  if (!user) {
    redirect("/sign-in");
  }

  const application = await db.wholesaleApplication.findFirst({
    where: {
      email: user.email,
    },
  });

  if (!application || application.status !== "APPROVED") {
    return (
      <div className="min-h-screen py-12 px-6">
        <div className="max-w-3xl mx-auto glass rounded-3xl p-10 text-center border border-jungle-900/60">
          <span className="text-6xl block mb-6">
            🍯
          </span>

          <h1 className="font-display text-4xl mb-4">
            Wholesale Access Pending
          </h1>

          <p className="text-zinc-300 leading-relaxed">
            Your wholesale access has not been approved yet. Please submit a
            wholesale application or wait for approval.
          </p>
        </div>
      </div>
    );
  }

  const products = await db.product.findMany({
    where: {
      active: true,
      type: {
        in: ["WHOLESALE", "BOTH"],
      },
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
            Wholesale Dashboard
          </p>

          <h1 className="font-display text-5xl mb-4">
            Welcome, {application.business}
          </h1>

          <p className="text-zinc-400">
            Approved wholesale products and bulk ordering options.
          </p>
        </div>

        {products.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center text-zinc-400">
            No wholesale products are available yet.
          </div>
        ) : (
          <div className="grid md:grid-cols-2 xl:grid-cols-3 gap-6">
            {products.map((product) => (
              <div
                key={product.id}
                className="glass rounded-3xl p-6 border border-jungle-900/60"
              >
                <h2 className="font-display text-3xl mb-3">
                  {product.name}
                </h2>

                {product.description && (
                  <p className="text-zinc-400 text-sm leading-relaxed mb-5 line-clamp-3">
                    {product.description}
                  </p>
                )}

                <div className="space-y-4">
                  {product.variants.map((variant) => (
                    <div
                      key={variant.id}
                      className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4"
                    >
                      <div className="flex items-center justify-between gap-4 mb-4">
                        <div>
                          <p className="font-semibold">
                            {variant.label}
                          </p>

                          <p
                            className="font-bold"
                            style={{ color: "#c89f4f" }}
                          >
                            {formatPrice(variant.price)}
                          </p>
                        </div>

                        <span
                          className={`text-xs ${
                            variant.inStock
                              ? "text-green-400"
                              : "text-red-400"
                          }`}
                        >
                          {variant.inStock ? "In Stock" : "Sold Out"}
                        </span>
                      </div>

                      <WholesaleOrderButton
                        variantId={variant.id}
                        disabled={!variant.inStock}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
