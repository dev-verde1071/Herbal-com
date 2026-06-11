export const dynamic = "force-dynamic";

import Image from "next/image";
import { Calendar, MapPin, Users, Clock } from "lucide-react";
import { db } from "@/lib/db";
import AddRetreatToCartButton from "@/components/AddRetreatToCartButton";
import BuyRetreatNowButton from "@/components/BuyRetreatNowButton";
import CartUrgencyNote from "@/components/CartUrgencyNote";

function getRetreatPrice(retreat: {
  price: number;
  clearanceActive: boolean;
  clearancePrice?: number | null;
  clearancePercent?: number | null;
}) {
  if (retreat.clearanceActive) {
    if (retreat.clearancePrice && retreat.clearancePrice > 0) {
      return retreat.clearancePrice;
    }

    if (retreat.clearancePercent && retreat.clearancePercent > 0) {
      const discount = retreat.price * (retreat.clearancePercent / 100);
      return Math.max(0, retreat.price - discount);
    }
  }

  return retreat.price;
}

function formatPrice(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(value);
}

export default async function RetreatsPage() {
  const retreats = await db.retreat.findMany({
    where: {
      active: true,
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-12 text-center">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Healing Retreats
          </p>

          <h1 className="font-display text-5xl md:text-6xl">
            Retreat Experiences
          </h1>

          <p className="text-zinc-400 mt-4 max-w-2xl mx-auto">
            Explore healing, wellness, cultural, and nature-based retreat
            experiences curated through Herbal Communities.
          </p>
        </div>

        {retreats.length === 0 ? (
          <div className="glass rounded-3xl p-12 text-center border border-jungle-900/60">
            <p className="text-5xl mb-5">🏕️</p>

            <h2 className="font-display text-3xl mb-3">
              No retreats available yet
            </h2>

            <p className="text-zinc-400">
              New retreat experiences will be added soon.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-8">
            {retreats.map((retreat) => {
              const soldOut =
                !retreat.inStock || retreat.spotsLeft <= 0 || retreat.spots <= 0;

              const checkoutPrice = getRetreatPrice(retreat);

              const hasDiscount =
                retreat.clearanceActive && checkoutPrice < retreat.price;

              return (
                <div
                  key={retreat.id}
                  className="glass rounded-3xl overflow-hidden border border-jungle-900/60"
                >
                  <div className="relative aspect-[16/10] bg-black/30">
                    {retreat.images?.[0] ? (
                      <Image
                        src={retreat.images[0]}
                        alt={retreat.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-7xl">
                        🏕️
                      </div>
                    )}

                    {hasDiscount && (
                      <div className="absolute top-4 left-4 rounded-full bg-red-900/90 border border-red-600/60 text-red-100 px-4 py-2 text-sm font-semibold">
                        Clearance{" "}
                        {retreat.clearancePercent
                          ? `${retreat.clearancePercent}% Off`
                          : "Sale"}
                      </div>
                    )}

                    {soldOut && (
                      <div className="absolute inset-0 bg-black/65 flex items-center justify-center">
                        <div className="rounded-2xl bg-red-950/90 border border-red-700 px-8 py-4 text-red-100 font-semibold text-xl">
                          Trip is fully booked
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-7">
                    <div className="flex flex-wrap items-center gap-3 mb-4 text-sm text-zinc-400">
                      {retreat.location && (
                        <span className="inline-flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-jungle-300" />
                          {retreat.location}
                        </span>
                      )}

                      {retreat.duration && (
                        <span className="inline-flex items-center gap-2">
                          <Clock className="w-4 h-4 text-jungle-300" />
                          {retreat.duration}
                        </span>
                      )}
                    </div>

                    <h2 className="font-display text-4xl mb-4">
                      {retreat.name}
                    </h2>

                    {retreat.description && (
                      <p className="text-zinc-300 leading-relaxed mb-6 whitespace-pre-line">
                        {retreat.description}
                      </p>
                    )}

                    <div className="grid sm:grid-cols-2 gap-4 mb-6">
                      <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                        <div className="flex items-center gap-2 text-jungle-300 mb-2">
                          <Users className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            Availability
                          </span>
                        </div>

                        <p className="text-zinc-300">
                          {soldOut
                            ? "Sold out"
                            : `${retreat.spotsLeft} of ${retreat.spots} spots left`}
                        </p>
                      </div>

                      <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4">
                        <div className="flex items-center gap-2 text-jungle-300 mb-2">
                          <Calendar className="w-4 h-4" />
                          <span className="text-sm font-semibold">
                            Dates
                          </span>
                        </div>

                        <p className="text-zinc-300">
                          {retreat.startDate
                            ? new Date(retreat.startDate).toLocaleDateString()
                            : "Dates coming soon"}
                        </p>
                      </div>
                    </div>

                    {retreat.includes.length > 0 && (
                      <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-5 mb-6">
                        <h3 className="font-semibold text-jungle-300 mb-3">
                          What’s Included
                        </h3>

                        <ul className="space-y-2 text-sm text-zinc-300">
                          {retreat.includes.map((item, index) => (
                            <li key={`${item}-${index}`}>• {item}</li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {retreat.videos?.length > 0 && (
                      <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-5 mb-6">
                        <h3 className="font-semibold text-jungle-300 mb-3">
                          Retreat Videos
                        </h3>

                        <div className="space-y-4">
                          {retreat.videos.map((video, index) => (
                            <video
                              key={`${video}-${index}`}
                              src={video}
                              controls
                              className="w-full rounded-2xl border border-jungle-900/60"
                            />
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-5">
                      <div>
                        <p className="text-sm text-zinc-500 mb-1">
                          Retreat Price
                        </p>

                        <div className="flex items-center gap-3">
                          <p
                            className="text-3xl font-bold"
                            style={{ color: "#c89f4f" }}
                          >
                            {formatPrice(checkoutPrice)}
                          </p>

                          {hasDiscount && (
                            <p className="text-zinc-500 line-through">
                              {formatPrice(retreat.price)}
                            </p>
                          )}
                        </div>

                        {!soldOut && <CartUrgencyNote retreatId={retreat.id} />}
                      </div>

                      {soldOut ? (
                        <div className="rounded-2xl bg-red-950/70 border border-red-800 px-6 py-4 text-red-200 font-semibold text-center">
                          Trip is sold out
                        </div>
                      ) : (
                        <div className="grid sm:grid-cols-2 gap-3 w-full sm:w-[360px]">
                          <AddRetreatToCartButton retreatId={retreat.id} />
                          <BuyRetreatNowButton retreatId={retreat.id} />
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
