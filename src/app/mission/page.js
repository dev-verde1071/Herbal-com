import SectionIntro from "@/components/section-intro";

export default function MissionPage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="Our Mission"
          title="To reconnect people with natural wellness, shared learning, and earth-centered living."
          copy="Herbal Communities exists to create a welcoming path into holistic habits, herbal understanding, and a stronger sense of connection between people, wellness, and the natural world."
        />

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Education</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              We aim to make natural wellness more approachable by sharing information in a way
              that feels grounded, clear, and community-focused.
            </p>
          </div>

          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Access</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              The long-term vision is to provide offerings that support different lifestyles,
              whether someone is beginning their wellness journey or deepening it.
            </p>
          </div>

          <div className="card p-7">
            <h3 className="text-xl font-semibold text-leaf-700">Community</h3>
            <p className="mt-3 text-sm leading-7 text-sand-700">
              Herbal Communities is built around shared growth, trust, and support — not just
              products, but a broader experience of healing and connection.
            </p>
          </div>
        </div>

        <div className="mt-14 card p-8 sm:p-10">
          <p className="eyebrow">What guides us</p>
          <div className="mt-4 grid gap-8 lg:grid-cols-2">
            <div>
              <h3 className="text-2xl font-semibold text-leaf-700">A wellness brand with intention</h3>
              <p className="mt-4 text-base leading-8 text-sand-700">
                Every part of Herbal Communities is meant to feel thoughtful, calm, and aligned
                with a larger purpose: helping people live with more awareness, more balance, and
                more respect for what nature provides.
              </p>
            </div>
            <div>
              <h3 className="text-2xl font-semibold text-leaf-700">A foundation for future growth</h3>
              <p className="mt-4 text-base leading-8 text-sand-700">
                This mission supports the future addition of retail products, wholesale offerings,
                tours, retreats, and educational resources without losing the heart of the brand.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
