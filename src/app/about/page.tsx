import Container from "@/components/container";
import PageHeader from "@/components/page-header";

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        title="About Herbal Communities"
        subtitle="Rooted in nature. United by wellness."
      />
      <div className="space-y-6 text-brand-800">
        <p>
          Herbal Communities was founded with one mission — to reconnect people with the
          healing power of the earth. Our products and retreats are designed to promote
          balance, mindfulness, and long-term wellness through natural ingredients and
          holistic practices.
        </p>
        <p>
          From hand-harvested herbs to eco-friendly packaging, every step we take honors the
          planet that sustains us. We believe in transparency, community, and nurturing the
          bond between people and nature.
        </p>
        <p>
          Our team includes herbalists, farmers, nutritionists, and wellness guides dedicated
          to empowering individuals to live healthier, more grounded lives.
        </p>
      </div>
    </Container>
  );
}
