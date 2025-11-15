import Container from "@/components/container";
import PageHeader from "@/components/page-header";

export default function TeamPage() {
  const team = [
    { name: "Lila Stone", role: "Founder & Herbalist" },
    { name: "Aaron Bloom", role: "Operations Director" },
    { name: "Maya Reed", role: "Wellness Retreat Coordinator" },
  ];

  return (
    <Container>
      <PageHeader title="Meet Our Team" subtitle="Dedicated to your wellness journey." />
      <div className="grid md:grid-cols-3 gap-8">
        {team.map((m, i) => (
          <div
            key={i}
            className="border border-brand-200 rounded-lg p-6 text-center shadow-sm"
          >
            <div className="w-24 h-24 rounded-full bg-leaf-100 mx-auto mb-3" />
            <h3 className="font-semibold text-leaf-700">{m.name}</h3>
            <p className="text-brand-700 text-sm">{m.role}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
