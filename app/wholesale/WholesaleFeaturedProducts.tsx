import ProductCard from "@/components/ProductCard";

type Variant = {
  id: string;
  label: string;
  price: number;
  compareAt?: number | null;
  qty: number;
  inStock: boolean;
  images?: string[];
};

type Product = {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  category: string;
  subcategory?: string | null;
  type?: "RETAIL" | "WHOLESALE" | "BOTH" | string;
  images?: string[];
  active: boolean;
  featured?: boolean;
  variants: Variant[];
};

type WholesaleFeaturedProductsProps = {
  products: Product[];
};

export default function WholesaleFeaturedProducts({
  products,
}: WholesaleFeaturedProductsProps) {
  if (products.length === 0) {
    return (
      <section className="glass rounded-3xl border border-jungle-900/60 p-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-jungle-300">
          Featured Wholesale
        </p>

        <h2 className="font-display text-3xl">
          Wholesale Products Coming Soon
        </h2>

        <p className="mt-4 leading-relaxed text-zinc-400">
          Featured wholesale products will appear here as they
          become available.
        </p>
      </section>
    );
  }

  return (
    <section className="glass rounded-3xl border border-jungle-900/60 p-6 sm:p-8">
      <div className="mb-8">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-jungle-300">
          Featured Wholesale
        </p>

        <h2 className="font-display text-3xl sm:text-4xl">
          Featured Bulk Products
        </h2>

        <p className="mt-3 leading-relaxed text-zinc-400">
          Preview selected wholesale offerings before creating an
          account and applying for access.
        </p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        {products.map((product) => (
          <ProductCard
            key={product.id}
            product={product}
            hrefOverride="/wholesale#wholesale-access"
          />
        ))}
      </div>

      <div
        id="wholesale-access"
        className="mt-8 rounded-2xl border border-jungle-900/60 bg-jungle-950/30 p-5 text-center"
      >
        <p className="text-sm leading-relaxed text-zinc-400">
          Create an account and submit a wholesale application to
          access complete pricing, inventory, and ordering.
        </p>
      </div>
    </section>
  );
}
