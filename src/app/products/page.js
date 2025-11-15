async function getProducts() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/products`, {
    next: { revalidate: 0 },
  });
  return res.json();
}

export default async function ProductsPage() {
  const { products } = await getProducts();

  return (
    <section className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-leaf-600">Our Products</h1>
        <p className="text-brand-700 mt-2">
          Explore our natural herbs and wellness offerings.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">

        {products.map((product) => (
          <div key={product.id} className="bg-white p-4 rounded shadow text-center">
            {/* Image */}
            {product.images?.[0] ? (
              <img
                src={product.images[0]}
                className="w-full h-40 object-cover rounded mb-3"
              />
            ) : (
              <div className="w-full h-40 bg-leaf-50 rounded mb-3"></div>
            )}

            <h3 className="font-semibold">{product.name}</h3>

            <p className="text-sm text-gray-600 mt-1">
              {product.metadata?.short_description || "No description available."}
            </p>

            {/* Price */}
            {product.default_price && (
              <p className="mt-2 font-bold text-leaf-600">
                ${(product.default_price.unit_amount / 100).toFixed(2)}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
