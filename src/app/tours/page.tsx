import Container from "@/components/container";
import PageHeader from "@/components/page-header";
import TourCard from "@/components/tour-card";

const sampleTours = [
  {
    id: 1,
    title: "Herbal Healing Retreat",
    location: "Asheville, North Carolina",
    date: "May 20–24, 2025",
    price: "$899",
  },
  {
    id: 2,
    title: "Meditation & Botanical Walk",
    location: "Sedona, Arizona",
    date: "June 10–12, 2025",
    price: "$499",
  },
  {
    id: 3,
    title: "Tropical Wellness Tour",
    location: "Maui, Hawaii",
    date: "August 1–7, 2025",
    price: "$1,250",
  },
  {
    id: 4,
    title: "Herbalist Weekend Workshop",
    location: "Boulder, Colorado",
    date: "September 13–15, 2025",
    price: "$650",
  },
];

export default function ToursPage() {
  return (
    <Container>
      <PageHeader
        title="Retreats & Tours"
        subtitle="Rejuvenate your body and soul with our nature-centered experiences."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleTours.map((tour) => (
          <TourCard key={tour.id} tour={tour} />
        ))}
      </div>
    </Container>
  );
}
