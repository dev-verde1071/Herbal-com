export const dynamic = "force-dynamic";
import Image from "next/image";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/utils";

export default async function RetreatsPage() {
  const retreats = await db.retreat.findMany({
    where: { active: true },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="max-w-3xl mb-16">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Herbal Communities
          </p>

          <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
            Healing Retreats
          </h1>

          <p className="text-zinc-300 text-lg leading-relaxed">
            Immerse yourself in transformative wellness experiences rooted in
            nature, healing, herbal traditions, and authentic cultural
            connection.
          </p>
        </div>

        {retreats.length === 0 ? (
          <div className="glass rounded-3xl p-20 text-center">
            <span className="text-6xl block mb-6">
              🌿
            </span>

            <h2 className="font-display text-3xl mb-4">
              Retreats Coming Soon
            </h2>

            <p className="text-zinc-400 max-w-xl mx-auto">
              We are preparing immersive healing retreats and wellness
              experiences. Check back soon.
            </p>
          </div>
        ) : (
          <div className="grid lg:grid-cols-2 gap-10">
            {retreats.map((retreat) => (
              <div
                key={retreat.id}
                className="glass rounded-3xl overflow-hidden border border-jungle-900/60"
              >
                <div className="relative h-80 bg-jungle-950">
                  {retreat.images[0] ? (
                    <Image
                      src={retreat.images[0]}
                      alt={retreat.name}
                      fill
                      className="object-cover"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-7xl text-jungle-700">
                      🌿
                    </div>
                  )}
                </div>

                <div className="p-8">
                  <div className="flex flex-wrap items-center gap-3 mb-4">
                    {retreat.location && (
                      <span className="text-xs uppercase tracking-widest text-jungle-300">
                        {retreat.location}
                      </span>
                    )}

                    {retreat.duration && (
                      <span className="text-xs text-zinc-500">
                        • {retreat.duration}
                      </span>
                    )}
                  </div>

                  <h2 className="font-display text-4xl mb-4">
                    {retreat.name}
                  </h2>

                  {retreat.description && (
                    <p className="text-zinc-300 leading-relaxed mb-6 line-clamp-4">
                      {retreat.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                        Starting At
                      </p>

                      <p
                        className="text-3xl font-bold"
                        style={{ color: "#c89f4f" }}
                      >
                        {formatPrice(retreat.price)}
                      </p>
                    </div>

                    <div className="text-right">
                      <p className="text-xs uppercase tracking-widest text-zinc-500 mb-1">
                        Spots Left
                      </p>

                      <p className="text-xl font-semibold text-white">
                        {retreat.spotsLeft}
                      </p>
                    </div>
                  </div>

                  <button className="w-full rounded-2xl bg-jungle-600 hover:bg-jungle-500 py-4 font-semibold transition">
                    Request Retreat Information
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
