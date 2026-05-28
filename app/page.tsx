export const dynamic = "force-dynamic";

import Link from "next/link";
import { ArrowRight, Leaf, Waves, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import ProductCard from "@/components/ProductCard";

async function getFeaturedProducts() {
  try {
    return await db.product.findMany({
      where: {
        active: true,
        featured: true,
        type: {
          in: ["RETAIL", "BOTH"],
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
      take: 6,
    });
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts();

  return (
    <div className="overflow-hidden">
      <section className="relative min-h-[90vh] flex items-center justify-center px-6">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(74,158,82,0.18),transparent_55%)]" />

        <div className="relative z-10 max-w-6xl mx-auto text-center">
          <p className="uppercase tracking-[0.4em] text-jungle-300 text-xs md:text-sm mb-6">
            Herbal Communities
          </p>

          <h1 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold leading-tight mb-8">
            Rare Herbs.
            <br />
            <span className="gold-shimmer">Real Communities.</span>
          </h1>

          <p className="max-w-2xl mx-auto text-lg md:text-xl text-zinc-300 leading-relaxed mb-10">
            Discover ethically sourced herbs, sea moss, stingless bee honey,
            natural oils, and wellness retreats connected directly to indigenous
            and local communities.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/products"
              className="group inline-flex items-center gap-2 rounded-2xl bg-jungle-500 hover:bg-jungle-400 px-8 py-4 font-semibold transition"
            >
              Shop Products
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>

            <Link
              href="/retreats"
              className="inline-flex items-center gap-2 rounded-2xl border border-jungle-500/40 bg-black/20 hover:bg-jungle-900/40 px-8 py-4 font-semibold transition"
            >
              Explore Retreats
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 px-6">
        <div className="max-w-6xl mx-auto grid md:grid-cols-3 gap-8">
          <div className="glass rounded-3xl p-8">
            <Leaf className="w-10 h-10 text-jungle-300 mb-6" />

            <h3 className="font-display text-2xl mb-4">
              Wildcrafted Herbs
            </h3>

            <p className="text-zinc-300 leading-relaxed">
              Carefully selected herbs and botanicals sourced from trusted
              growers and traditional communities.
            </p>
          </div>

          <div className="glass rounded-3xl p-8">
            <Waves className="w-10 h-10 text-cyan-300 mb-6" />

            <h3 className="font-display text-2xl mb-4">
              Premium Sea Moss
            </h3>

            <p className="text-zinc-300 leading-relaxed">
              Honduran, Jamaican, and Peruvian sea moss harvested with care and
              prepared for maximum quality.
            </p>
          </div>

          <div className="glass rounded-3xl p-8">
            <Sparkles className="w-10 h-10 text-amber-300 mb-6" />

            <h3 className="font-display text-2xl mb-4">
              Healing Retreats
            </h3>

            <p className="text-zinc-300 leading-relaxed">
              Immersive wellness experiences rooted in healing, culture,
              education, and natural living.
            </p>
          </div>
        </div>

        {featuredProducts.length > 0 && (
          <div className="max-w-7xl mx-auto mt-20">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6 mb-10">
              <div>
                <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
                  Featured Products
                </p>

                <h2 className="font-display text-4xl md:text-5xl">
                  Featured on Herbal Communities
                </h2>

                <p className="text-zinc-400 mt-3">
                  Showing up to 6 highlighted retail products.
                </p>
              </div>

              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-jungle-300 hover:text-white transition font-semibold"
              >
                View all products
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product as any} />
              ))}
            </div>
          </div>
        )}
      </section>

      <section className="py-24 px-6 border-t border-jungle-800/40">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-14 items-center">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              About Herbal Communities
            </p>

            <h2 className="font-display text-4xl md:text-5xl leading-tight mb-6">
              Wellness connected directly to community.
            </h2>

            <p className="text-zinc-300 leading-relaxed mb-6">
              We believe wellness should benefit the people and lands it comes
              from. Herbal Communities partners with local and indigenous
              producers to bring authentic natural products directly to people
              seeking holistic living.
            </p>

            <p className="text-zinc-400 leading-relaxed mb-8">
              From Melipona stingless bee honey to handcrafted oils and healing
              herbs, every product carries a story rooted in culture and care.
            </p>

            <Link
              href="/about"
              className="inline-flex items-center gap-2 text-jungle-300 hover:text-white transition"
            >
              Learn More
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          <div className="relative">
            <div className="aspect-[4/5] rounded-[2rem] bg-gradient-to-br from-jungle-700/40 to-black border border-jungle-500/20 overflow-hidden" />

            <div className="absolute -bottom-6 -left-6 glass rounded-3xl p-6 max-w-xs">
              <p className="text-sm text-zinc-300 leading-relaxed">
                “Authentic wellness sourced through culture, nature, and trust.”
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
