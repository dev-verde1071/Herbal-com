import Container from "@/components/container";

export default function HomePage() {
  return (
    <Container>
      <section className="text-center py-16">
        <h1 className="text-4xl font-bold text-leaf-700 mb-4">
          Welcome to Herbal Communities
        </h1>
        <p className="text-brand-700 max-w-2xl mx-auto">
          Discover natural remedies, herbal products, and rejuvenating retreats designed to
          promote holistic health and community wellness. Join us on a journey toward balance,
          vitality, and connection with nature.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <a
            href="/products"
            className="btn-primary px-6 py-3 rounded-lg font-medium"
          >
            Explore Products
          </a>
          <a
            href="/tours"
            className="btn-accent px-6 py-3 rounded-lg font-medium"
          >
            View Retreats
          </a>
        </div>
      </section>

      <section className="grid md:grid-cols-3 gap-8 py-12">
        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">Natural Ingredients</h3>
          <p className="text-brand-700 text-sm">
            Every product is crafted using organically grown herbs and botanicals sourced
            from trusted farms.
          </p>
        </div>

        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">Community Driven</h3>
          <p className="text-brand-700 text-sm">
            Herbal Communities brings people together through workshops, retreats, and shared
            wellness experiences.
          </p>
        </div>

        <div className="card p-6 text-center">
          <h3 className="text-xl font-semibold text-leaf-700 mb-2">Sustainable Practices</h3>
          <p className="text-brand-700 text-sm">
            We care for the earth as much as for your health — eco-conscious sourcing and
            biodegradable packaging.
          </p>
        </div>
      </section>
    </Container>
  );
}
