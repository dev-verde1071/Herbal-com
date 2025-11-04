export default function ProductCard({ product }: { product: any }) {
  return (
    <div className="card p-4 text-center">
      <h3 className="text-lg font-semibold text-leaf-700">{product.name}</h3>
      <p className="text-brand-700 text-sm mb-2">{product.description}</p>
      <p className="font-medium text-leaf-800">{product.price}</p>
      <button className="btn-primary mt-3 px-4 py-2 rounded-lg w-full">Add to Cart</button>
    </div>
  );
}
