import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-sand-200 bg-white">
      <div className="site-container section-spacing">
        <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="eyebrow">Herbal Communities</p>
            <h3 className="mt-3 text-2xl font-semibold text-leaf-700">
              Natural wellness through education, care, and community.
            </h3>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600">
              Explore
            </h4>
            <div className="mt-4 space-y-3">
              <Link href="/" className="block text-sm text-sand-700 hover:text-leaf-700">Home</Link>
              <Link href="/mission" className="block text-sm text-sand-700 hover:text-leaf-700">Mission</Link>
              <Link href="/about" className="block text-sm text-sand-700 hover:text-leaf-700">About</Link>
              <Link href="/team" className="block text-sm text-sand-700 hover:text-leaf-700">Team</Link>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600">
              Future Shop
            </h4>
            <div className="mt-4 space-y-3 text-sm text-sand-700">
              <p>All Products</p>
              <p>Retail</p>
              <p>Wholesale</p>
              <p>Tours & Retreats</p>
            </div>
          </div>

          <div>
            <h4 className="text-sm font-semibold uppercase tracking-[0.18em] text-leaf-600">
              Contact
            </h4>
            <div className="mt-4 space-y-3 text-sm text-sand-700">
              <p>Connect with Herbal Communities for future offerings, wellness updates, and community news.</p>
            </div>
          </div>
        </div>

        <div className="mt-12 border-t border-sand-200 pt-6 text-sm text-sand-600">
          © {new Date().getFullYear()} Herbal Communities. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
