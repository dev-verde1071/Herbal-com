import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";

export default function AboutPage() {
  return (
    <Container>
      <PageHeader title="About Us" subtitle="Rooted in nature, driven by wellness." />
      <p className="text-brand-800 leading-relaxed">
        Herbal Communities was founded on the belief that the earth provides
        everything we need to thrive. Our mission is to empower individuals
        through herbal knowledge, natural remedies, and mindful experiences.
        From handcrafted products to immersive retreats, we are cultivating a
        global community focused on holistic living.
      </p>
    </Container>
  );
}
