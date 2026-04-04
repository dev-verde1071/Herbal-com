import SectionIntro from "@/components/section-intro";

export default function WholesalePage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="Shop"
          title="Wholesale"
          copy="Wholesale offerings will appear here once the business-facing catalog is ready."
        />
        <div className="mt-10 card p-8">
          <p className="text-base leading-8 text-sand-700">
            This page is reserved for larger-volume purchasing, business partnerships, and future wholesale opportunities.
          </p>
        </div>
      </div>
    </section>
  );
}
