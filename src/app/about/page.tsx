import Container from "@/components/container";
import PageHeader from "@/components/page-header";

export default function AboutPage() {
  return (
    <Container>
      <PageHeader
        title="About Herbal Communities"
        subtitle="Empowering holistic living through nature."
      />
      <div className="max-w-3xl mx-auto text-brand-800 leading-relaxed space-y-6">
        <p>
          Herbal Communities was born from a passion for reconnecting people with the healing
          powers of nature. We believe that natural wellness should be accessible, sustainable,
          and rooted in community.
        </p>
        <p>
          From our herbal remedies to our immersive wellness tours, every experience we offer is
          crafted to support the mind, body, and spirit. Join us as we grow a global movement
          for conscious living.
        </p>
        <p>
          Our commitment: transparency, sustainability, and holistic care — for you and for
          the planet.
        </p>
      </div>
    </Container>
  );
}
