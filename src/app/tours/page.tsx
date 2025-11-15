import Container from "@/components/container";
import PageHeader from "@/components/page-header";
import TourCard from "@/components/tour-card";
import { getStripeProductsByType } from "@/lib/stripe";

export default async function ToursPage() {
  const tours = await getStripeProductsByType("tour");

  return (
    <Container>
      <PageHeader
        title="Wellness Tours & Retreats"
        subtitle="Join our holistic retreats and rejuvenate your spirit — all synced from Stripe."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {tours.length > 0 ? (
          tours.map((t) => <TourCard key={t.id} tour={t} />)
        ) : (
          <p className="text-center text-brand-700">
            No tours found. Add some with <code>metadata.category: tour</code> in Stripe.
          </p>
        )}
      </div>
    </Container>
  );
}
