import SectionIntro from "@/components/section-intro";

const teamMembers = [
  {
    name: "Lila Stone",
    role: "Founder & Herbal Wellness Visionary",
    bio: "Focused on shaping Herbal Communities into a grounded brand centered on holistic living, natural education, and long-term community impact."
  },
  {
    name: "Aaron Bloom",
    role: "Operations & Brand Development",
    bio: "Supports the structure, growth direction, and future expansion of Herbal Communities as the platform evolves into products and wellness offerings."
  },
  {
    name: "Maya Reed",
    role: "Community & Experience Coordinator",
    bio: "Represents the community-centered side of the brand, helping guide the tone, experience, and future wellness-focused initiatives."
  }
];

export default function TeamPage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="Meet the Team"
          title="A thoughtful team guiding the Herbal Communities vision forward."
          copy="The Herbal Communities team is presented here as a polished brand-facing introduction that helps your client visualize the people and roles behind the mission."
          align="center"
        />

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member) => (
            <div key={member.name} className="card overflow-hidden p-7">
              <div className="mb-5 h-44 rounded-2xl bg-gradient-to-br from-leaf-100 via-sand-100 to-white" />
              <h3 className="text-xl font-semibold text-leaf-700">{member.name}</h3>
              <p className="mt-1 text-sm font-medium uppercase tracking-[0.14em] text-sand-600">
                {member.role}
              </p>
              <p className="mt-4 text-sm leading-7 text-sand-700">{member.bio}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
