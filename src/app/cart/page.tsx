import Container from "@/src/components/container";
import PageHeader from "@/src/components/page-header";

export default function CartPage() {
  const items = [
    { id: 1, name: "Sea Moss Gel", price: "$19.99", quantity: 1 },
    { id: 2, name: "Jungle Herb Retreat", price: "$799.00", quantity: 1 },
  ];

  const total = "$818.99";

  return (
    <Container>
      <PageHeader title="Your Cart" subtitle="Review your items before checkout." />
      <div className="space-y-4">
        {items.map((i) => (
          <div key={i.id} className="card flex justify-between items-center p-4">
            <div>
              <p className="font-medium text-leaf-700">{i.name}</p>
              <p className="text-sm text-brand-700">Qty: {i.quantity}</p>
            </div>
            <p className="font-semibold text-leaf-700">{i.price}</p>
          </div>
        ))}
      </div>
      <div className="text-right mt-6">
        <p className="text-xl font-bold text-leaf-700">Total: {total}</p>
        <button className="btn-primary mt-4 px-6 py-2 rounded-lg">Checkout</button>
      </div>
    </Container>
  );
}
