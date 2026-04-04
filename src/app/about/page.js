import SectionIntro from "@/components/section-intro";

export default function AboutPage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="About Herbal Communities"
          title="A brand rooted in natural living, holistic awareness, and meaningful connection."
          copy="Herbal Communities is being developed as a trusted space where wellness, education, and community can come together in a way that feels grounded, warm, and clear."
        />

        <div className="mt-12 grid gap-10 lg:grid-cols-[.9fr_1.1fr]">
          <div className="card p-8">
            <p className="eyebrow">Who we are</p>
            <h3 className="mt-3 text-2xl font-semibold text-leaf-700">
              A modern brand with a heritage-inspired heart.
            </h3>
            <p className="mt-4 text-base leading-8 text-sand-700">
              Herbal Communities takes inspiration from longstanding traditions of plant knowledge,
              natural care, and shared wellness practices while presenting them through a clean,
              modern experience.
            </p>
          </div>

          <div className="space-y-5 text-base leading-8 text-sand-700">
            <p>
              The brand is intended to feel welcoming to people who are curious about natural
              living and holistic wellness, while also providing enough structure and credibility
              to grow into a larger destination over time.
            </p>
            <p>
              That future may include educational content, curated wellness experiences, product
              collections, wholesale options, and more — all built around a clear visual identity
              and a calm, community-centered tone.
            </p>
            <p>
              For now, Herbal Communities begins with a strong foundation: clear messaging,
              thoughtful design, and a mission that centers people, knowledge, and nature.
            </p>
          </div>
        </div>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Natural</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              The brand prioritizes an earth-centered look and feel that reflects its wellness focus.
            </p>
          </div>

          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Intentional</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              Every page is designed to feel purposeful, not crowded, so visitors can absorb the brand clearly.
            </p>
          </div>

          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Expandable</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              The structure is ready to grow into commerce, education, and experiences later on.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
