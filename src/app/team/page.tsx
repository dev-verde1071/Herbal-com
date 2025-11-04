import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";

export default function TeamPage() {
  const team = [
    { name: "Maya Green", role: "Founder & Herbalist" },
    { name: "Luis Gomez", role: "Operations Lead" },
    { name: "Ella Baker", role: "R&D Specialist" },
  ];

  return (
    <Container>
      <PageHeader title="Our Team" subtitle="Meet the people behind Herbal Communities." />
      <div className="grid-auto">
        {team.map((m, i) => (
          <div key={i} className="card text-center p-6">
            <h3 className="font-semibold text-lg text-leaf-700">{m.name}</h3>
            <p className="text-brand-700">{m.role}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
