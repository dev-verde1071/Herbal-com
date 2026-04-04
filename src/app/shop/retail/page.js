import SectionIntro from "@/components/section-intro";

export default function RetailPage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="Shop"
          title="Retail"
          copy="Retail offerings will appear here once the product catalog is ready."
        />
        <div className="mt-10 card p-8">
          <p className="text-base leading-8 text-sand-700">
            This page is reserved for individual customer purchases and future retail collections.
          </p>
        </div>
      </div>
    </section>
  );
}
