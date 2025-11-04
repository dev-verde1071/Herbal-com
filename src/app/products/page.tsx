import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";
import ProductCard from "@/src/components/product-card";

export default function ProductsPage() {
  const products = [
    { id: 1, name: "Raw Honey", description: "Pure, unfiltered wildflower honey.", price: "$14.99" },
    { id: 2, name: "Sea Moss Gel", description: "Mineral-rich small batch gel.", price: "$19.99" },
    { id: 3, name: "Herbal Detox Tea", description: "Natural body cleanse blend.", price: "$9.99" },
  ];

  return (
    <Container>
      <PageHeader title="Our Products" subtitle="Crafted by nature, delivered to you." />
      <div className="grid-auto">
        {products.map((p) => (
          <ProductCard key={p.id} product={p} />
        ))}
      </div>
    </Container>
  );
}
