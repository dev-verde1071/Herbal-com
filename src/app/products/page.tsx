import Container from "@/components/container";
import PageHeader from "@/components/page-header";
import ProductCard from "@/components/product-card";

const sampleProducts = [
  { id: 1, name: "Herbal Tea Blend", description: "A calming mix of chamomile, mint, and lemongrass.", price: "$12.99" },
  { id: 2, name: "Elderberry Syrup", description: "Immunity-boosting syrup made with fresh elderberries and honey.", price: "$18.50" },
  { id: 3, name: "Turmeric Capsules", description: "Organic turmeric with black pepper extract for optimal absorption.", price: "$22.00" },
  { id: 4, name: "Detox Tincture", description: "Supports liver health and natural detox pathways.", price: "$14.75" },
  { id: 5, name: "Sea Moss Gel", description: "Wildcrafted sea moss packed with 92 essential minerals.", price: "$25.00" },
  { id: 6, name: "Lavender Bath Salts", description: "Relax and rejuvenate with soothing lavender-infused salts.", price: "$10.50" },
];

export default function ProductsPage() {
  return (
    <Container>
      <PageHeader
        title="Herbal Products"
        subtitle="Explore our collection of natural remedies and health essentials."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sampleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </Container>
  );
}
