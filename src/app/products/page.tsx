import Container from "@/components/container";
import PageHeader from "@/components/page-header";
import ProductCard from "@/components/product-card";
import { getStripeProductsByType } from "@/lib/stripe";

export default async function ProductsPage() {
  const products = await getStripeProductsByType("product");

  return (
    <Container>
      <PageHeader
        title="Herbal Products"
        subtitle="Natural remedies crafted with care — fetched live from Stripe."
      />
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {products.length > 0 ? (
          products.map((p) => <ProductCard key={p.id} product={p} />)
        ) : (
          <p className="text-center text-brand-700">
            No products available yet. Add some in your Stripe Dashboard.
          </p>
        )}
      </div>
    </Container>
  );
}
