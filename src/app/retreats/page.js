async function getRetreats() {
  const res = await fetch(`${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats`, {
    next: { revalidate: 0 },
  });
  return res.json();
}

export default async function RetreatsPage() {
  const { retreats } = await getRetreats();

  return (
    <section className="max-w-4xl mx-auto space-y-12">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-leaf-600">Healing Retreats</h1>
        <p className="text-brand-700 mt-2">
          Transformative, nature-centered retreats to restore your mind and body.
        </p>
      </div>

      <div className="space-y-10">

        {retreats.map((retreat) => (
          <div key={retreat.id} className="bg-white p-6 rounded shadow">
            <h2 className="text-2xl font-semibold text-leaf-600">
              {retreat.name}
            </h2>

            <p className="mt-2 text-gray-700">
              {retreat.metadata?.long_description ||
                "No description provided."}
            </p>

            {/* Price */}
            {retreat.default_price && (
              <p className="mt-2 font-bold text-leaf-600">
                ${(retreat.default_price.unit_amount / 100).toFixed(2)}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
