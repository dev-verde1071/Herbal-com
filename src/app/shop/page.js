import SectionIntro from "@/components/section-intro";

export default function ShopPage() {
  return (
    <section className="section-spacing">
      <div className="site-container">
        <SectionIntro
          eyebrow="Shop"
          title="All Products"
          copy="This section is being prepared for future product releases. It is included now to establish the storefront structure for the Herbal Communities brand."
        />
        <div className="mt-10 card p-8">
          <p className="text-base leading-8 text-sand-700">
            Product collections will be added here later, with categories for retail, wholesale,
            and future offerings connected to inventory and payment systems.
          </p>
        </div>
      </div>
    </section>
  );
}
