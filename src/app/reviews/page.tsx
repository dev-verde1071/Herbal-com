import Container from "@/components/container";
import PageHeader from "@/components/page-header";

export default function ReviewsPage() {
  const reviews = [
    {
      name: "Sarah M.",
      text: "The herbal teas are life-changing! I feel rejuvenated every morning.",
    },
    {
      name: "James L.",
      text: "Went on a retreat last spring — the scenery, the staff, everything was healing.",
    },
    {
      name: "Aisha R.",
      text: "I love how all the ingredients are sustainably sourced.",
    },
  ];

  return (
    <Container>
      <PageHeader title="Community Reviews" subtitle="See what our customers are saying." />
      <div className="grid md:grid-cols-3 gap-8">
        {reviews.map((r, i) => (
          <div key={i} className="border border-brand-200 rounded-lg p-6 shadow-sm">
            <p className="italic text-brand-700 mb-4">“{r.text}”</p>
            <p className="font-semibold text-leaf-700">— {r.name}</p>
          </div>
        ))}
      </div>
    </Container>
  );
}
