import Link from "next/link";
import SectionIntro from "@/components/section-intro";

export default function HomePage() {
  return (
    <>
      <section className="section-spacing">
        <div className="site-container">
          <div className="grid items-center gap-12 lg:grid-cols-[1.15fr_.85fr]">
            <div>
              <p className="eyebrow">Herbal Communities</p>
              <h1 className="mt-3 text-4xl font-semibold leading-tight text-leaf-700 sm:text-5xl lg:text-6xl">
                A modern wellness brand rooted in nature, heritage, and community.
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-8 text-sand-700 sm:text-lg">
                Herbal Communities is being shaped as a welcoming destination for natural living,
                herbal learning, community connection, and future wellness offerings that help
                people live more grounded, informed, and intentional lives.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Link href="/mission" className="btn-primary">
                  Explore Our Mission
                </Link>
                <Link href="/about" className="btn-secondary">
                  Learn About Herbal Communities
                </Link>
              </div>
            </div>

            <div className="card overflow-hidden p-6 sm:p-8">
              <div className="rounded-2xl bg-gradient-to-br from-leaf-100 via-sand-100 to-white p-8">
                <p className="eyebrow">What this brand stands for</p>
                <div className="mt-5 space-y-5">
                  <div>
                    <h3 className="text-xl font-semibold text-leaf-700">Natural Wellness</h3>
                    <p className="mt-2 text-sm leading-7 text-sand-700">
                      A return to earth-centered habits, ingredients, and practices that support
                      long-term well-being.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-leaf-700">Community Connection</h3>
                    <p className="mt-2 text-sm leading-7 text-sand-700">
                      Building trust, education, and shared experiences around healing, lifestyle,
                      and growth.
                    </p>
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold text-leaf-700">Future Expansion</h3>
                    <p className="mt-2 text-sm leading-7 text-sand-700">
                      This site is designed to grow into products, tours, and deeper wellness
                      experiences over time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing bg-white">
        <div className="site-container">
          <SectionIntro
            eyebrow="Foundations"
            title="Built to feel credible, calm, and community-centered."
            copy="The direction for Herbal Communities blends an earthy wellness look with a modern, organized structure so the brand feels both grounded and ready to grow."
            align="center"
          />

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            <div className="card p-7">
              <h3 className="text-xl font-semibold text-leaf-700">Clear Brand Story</h3>
              <p className="mt-3 text-sm leading-7 text-sand-700">
                The site communicates why Herbal Communities exists, what it values, and how it
                serves people seeking a more natural lifestyle.
              </p>
            </div>

            <div className="card p-7">
              <h3 className="text-xl font-semibold text-leaf-700">Strong Visual Identity</h3>
              <p className="mt-3 text-sm leading-7 text-sand-700">
                Cream backgrounds, leaf-green accents, and warm sand tones create a look that
                feels clean, restorative, and trustworthy.
              </p>
            </div>

            <div className="card p-7">
              <h3 className="text-xl font-semibold text-leaf-700">Ready for Growth</h3>
              <p className="mt-3 text-sm leading-7 text-sand-700">
                The layout is structured so products, retreats, educational resources, and future
                features can be added later without rebuilding the brand from scratch.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="section-spacing">
        <div className="site-container grid gap-10 lg:grid-cols-2">
          <div>
            <p className="eyebrow">Brand direction</p>
            <h2 className="section-title">Herbal Communities is designed to communicate trust, heritage, and intention.</h2>
          </div>
          <div className="space-y-5 text-base leading-8 text-sand-700">
            <p>
              The site direction draws from established natural wellness brands by combining
              strong storytelling, structured sections, and a warm visual presentation that feels
              both commercial and deeply personal.
            </p>
            <p>
              For the client presentation, this gives Herbal Communities a polished presence now,
              while leaving space for future product and tour pages to fit in naturally later.
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
