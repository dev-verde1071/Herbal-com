import Container from "@/components/container";

export default function HomePage() {
  return (
    <Container>
      <section className="text-center py-20">
        <h1 className="text-5xl font-bold text-leaf-700 mb-4">
          Welcome to Herbal Communities 🌿
        </h1>
        <p className="text-brand-700 max-w-2xl mx-auto text-lg">
          Explore our world of natural wellness — from herbal products to
          transformative retreats and tours designed to restore balance to body and mind.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/products"
            className="btn-primary px-6 py-3 rounded-lg font-semibold"
          >
            Explore Products
          </a>
          <a
            href="/tours"
            className="btn-accent px-6 py-3 rounded-lg font-semibold"
          >
            Book a Retreat
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-16">
        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">
            🌱 Pure Ingredients
          </h3>
          <p className="text-brand-700 text-sm">
            Hand-selected herbs and botanicals, cultivated sustainably and blended with care.
          </p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">
            🤝 Community Focused
          </h3>
          <p className="text-brand-700 text-sm">
            Join a growing network of like-minded individuals embracing natural wellness.
          </p>
        </div>
        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">
            🌍 Sustainable Practices
          </h3>
          <p className="text-brand-700 text-sm">
            We protect our planet with eco-friendly packaging and responsible sourcing.
          </p>
        </div>
      </section>
    </Container>
  );
}
