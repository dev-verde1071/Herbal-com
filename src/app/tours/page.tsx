import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";
import TourCard from "@/src/components/tour-card";

export default function ToursPage() {
  const tours = [
    { id: 1, title: "Jungle Herb Retreat", location: "Costa Rica", date: "May 15–20, 2025", price: "$799" },
    { id: 2, title: "Mountain Wellness Tour", location: "Colorado", date: "July 2–6, 2025", price: "$649" },
    { id: 3, title: "Ocean Detox Escape", location: "Bali", date: "Sept 1–5, 2025", price: "$899" },
  ];

  return (
    <Container>
      <PageHeader title="Tours & Retreats" subtitle="Reconnect with nature through guided experiences." />
      <div className="grid-auto">
        {tours.map((t) => (
          <TourCard key={t.id} tour={t} />
        ))}
      </div>
    </Container>
  );
}
