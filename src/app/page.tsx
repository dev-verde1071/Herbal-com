import Container from "@/components/container";
import Link from "next/link";

export default function HomePage() {
  return (
    <Container>
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-leaf-700 mb-4">
          Welcome to Herbal Communities
        </h1>
        <p className="max-w-2xl mx-auto text-brand-700 mb-8">
          Embrace nature’s wisdom. Discover herbs, natural remedies, and
          rejuvenating retreats designed to restore balance and wellness.
        </p>
        <div className="flex justify-center gap-4">
          <Link href="/products" className="btn-primary px-6 py-3 rounded-lg">
            Explore Products
          </Link>
          <Link href="/tours" className="btn-accent px-6 py-3 rounded-lg">
            View Retreats
          </Link>
        </div>
      </section>
    </Container>
  );
}
