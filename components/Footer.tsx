import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-jungle-800/40 bg-black/30">
      <div className="max-w-7xl mx-auto px-6 py-16">
        <div className="grid md:grid-cols-4 gap-10">
          <div>
            <h3 className="font-display text-2xl mb-4">
              Herbal Communities
            </h3>

            <p className="text-zinc-400 leading-relaxed text-sm">
              Ethical herbs, wellness products, sea moss, stingless bee honey,
              and healing retreats rooted in community.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-jungle-300">
              Shop
            </h4>

            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/products">Products</Link>
              <Link href="/retreats">Retreats</Link>
              <Link href="/wholesale">Wholesale</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-jungle-300">
              Company
            </h4>

            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <Link href="/about">About</Link>
              <Link href="/reviews">Reviews</Link>
            </div>
          </div>

          <div>
            <h4 className="font-semibold mb-4 text-jungle-300">
              Social
            </h4>

            <div className="flex flex-col gap-3 text-sm text-zinc-400">
              <a
                href="https://www.instagram.com/herbcom_"
                target="_blank"
              >
                Instagram
              </a>

              <a
                href="https://www.facebook.com/share/1Fry7QcUcm/"
                target="_blank"
              >
                Facebook
              </a>
            </div>
          </div>
        </div>

        <div className="mt-16 pt-8 border-t border-jungle-800/30 text-center text-xs text-zinc-500">
          © {new Date().getFullYear()} Herbal Communities. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
