import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";
import ReviewCard from "@/src/components/review-card";

export default function ReviewsPage() {
  const reviews = [
    { id: 1, name: "Ava", rating: 5, body: "The sea moss changed my mornings!" },
    { id: 2, name: "Jon", rating: 5, body: "Beautifully packaged and authentic quality." },
    { id: 3, name: "Maya", rating: 4, body: "Loved the honey, delivery was fast." },
  ];

  return (
    <Container>
      <PageHeader title="Customer Reviews" subtitle="Real feedback from our community." />
      <div className="grid-auto">
        {reviews.map((r) => (
          <ReviewCard key={r.id} review={r} />
        ))}
      </div>
    </Container>
  );
}
