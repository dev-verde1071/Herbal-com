type WholesaleVariant = {
  id: string;
  name?: string | null;
  price: unknown;
  inventory?: number | null;
};

type WholesaleProduct = {
  id: string;
  name: string;
  description?: string | null;
  imageUrl?: string | null;
  image?: string | null;
  variants?: WholesaleVariant[];
};

type WholesaleFeaturedProductsProps = {
  products: WholesaleProduct[];
};

function formatPrice(value: unknown) {
  const numericValue = Number(value);

  if (!Number.isFinite(numericValue)) {
    return null;
  }

  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(numericValue);
}

function getStartingPrice(product: WholesaleProduct) {
  const prices =
    product.variants
      ?.map((variant) => Number(variant.price))
      .filter((price) => Number.isFinite(price)) ?? [];

  if (prices.length === 0) {
    return null;
  }

  return Math.min(...prices);
}

function getProductImage(product: WholesaleProduct) {
  return product.imageUrl || product.image || null;
}

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
          Featured wholesale products will appear here as they become
          available.
        </p>
      </section>
    );
  }

  return (
    <section className="glass rounded-3xl border border-jungle-900/60 p-6 sm:p-8">
      <div className="mb-7">
        <p className="mb-3 text-xs uppercase tracking-[0.3em] text-jungle-300">
          Featured Wholesale
        </p>

        <h2 className="font-display text-3xl sm:text-4xl">
          Featured Bulk Products
        </h2>

        <p className="mt-3 leading-relaxed text-zinc-400">
          Preview selected wholesale products before creating an account and
          applying for access.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {products.map((product) => {
          const startingPrice = getStartingPrice(product);
          const productImage = getProductImage(product);

          return (
            <article
              key={product.id}
              className="overflow-hidden rounded-2xl border border-jungle-900/70 bg-black/10"
            >
              {productImage ? (
                <div className="aspect-[4/3] overflow-hidden bg-jungle-950/60">
                  <img
                    src={productImage}
                    alt={product.name}
                    className="h-full w-full object-cover transition duration-500 hover:scale-105"
                  />
                </div>
              ) : (
                <div className="flex aspect-[4/3] items-center justify-center bg-gradient-to-br from-jungle-950 to-jungle-900/50 px-5 text-center">
                  <span className="font-display text-2xl text-jungle-200/70">
                    Herbal Communities
                  </span>
                </div>
              )}

              <div className="p-5">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <h3 className="text-lg font-semibold leading-snug text-zinc-100">
                    {product.name}
                  </h3>

                  <span className="shrink-0 rounded-full border border-jungle-700/70 bg-jungle-900/40 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wider text-jungle-300">
                    Wholesale
                  </span>
                </div>

                {product.description ? (
                  <p className="line-clamp-3 text-sm leading-relaxed text-zinc-400">
                    {product.description}
                  </p>
                ) : (
                  <p className="text-sm leading-relaxed text-zinc-500">
                    Bulk product details are available to approved wholesale
                    customers.
                  </p>
                )}

                <div className="mt-5 border-t border-jungle-900/60 pt-4">
                  {startingPrice !== null ? (
                    <p className="text-sm text-zinc-400">
                      Starting at{" "}
                      <span className="font-semibold text-jungle-300">
                        {formatPrice(startingPrice)}
                      </span>
                    </p>
                  ) : (
                    <p className="text-sm text-zinc-500">
                      Wholesale pricing available after approval
                    </p>
                  )}
                </div>
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-7 rounded-2xl border border-jungle-900/60 bg-jungle-950/30 p-5 text-center">
        <p className="text-sm leading-relaxed text-zinc-400">
          Create an account and submit a wholesale application to access full
          pricing, inventory, and ordering.
        </p>
      </div>
    </section>
  );
}
