export default function AboutPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-5xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
          Our Story
        </p>

        <h1 className="font-display text-5xl md:text-6xl leading-tight mb-8">
          Wellness rooted in culture, community, and nature.
        </h1>

        <div className="grid lg:grid-cols-2 gap-12 text-zinc-300 leading-relaxed">
          <div className="space-y-6">
            <p>
              Herbal Communities was created to connect people with authentic
              herbs, natural foods, sea moss, stingless bee honey, oils, and
              wellness products sourced through trusted community relationships.
            </p>

            <p>
              We believe wellness is more than a product. It is a relationship
              between people, land, tradition, and responsibility.
            </p>

            <p>
              Our mission is to help support the communities that grow, harvest,
              prepare, and preserve these natural resources while giving
              customers access to high-quality holistic goods.
            </p>
          </div>

          <div className="glass rounded-3xl p-8 border border-jungle-900/60">
            <h2 className="font-display text-3xl text-white mb-6">
              What We Stand For
            </h2>

            <ul className="space-y-4">
              <li>🌿 Ethical sourcing</li>
              <li>🍯 Community-centered trade</li>
              <li>🌊 Natural wellness education</li>
              <li>✨ Respect for traditional knowledge</li>
              <li>🤝 Long-term relationship building</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
