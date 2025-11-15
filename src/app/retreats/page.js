async function getRetreats() {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_SITE_URL}/api/retreats`,
    { next: { revalidate: 0 } }
  );

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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">

        {retreats.map((retreat) => (
          <div key={retreat.id} className="bg-white p-6 rounded shadow">
            
            {/* IMAGE */}
            {retreat.images?.length > 0 ? (
              <img
                src={retreat.images[0]}
                alt={retreat.name}
                className="w-full h-52 object-cover rounded mb-4"
              />
            ) : (
              <div className="w-full h-52 bg-leaf-100 rounded mb-4"></div>
            )}

            {/* NAME */}
            <h2 className="text-2xl font-semibold text-leaf-600">
              {retreat.name}
            </h2>

            {/* DESCRIPTION (Stripe description or metadata long_description) */}
            <p className="mt-2 text-gray-700">
              {retreat.description ||
                retreat.metadata?.long_description ||
                "No description provided."}
            </p>

            {/* PRICE */}
            {retreat.default_price && (
              <p className="mt-3 font-bold text-leaf-600">
                ${(retreat.default_price.unit_amount / 100).toFixed(2)}
              </p>
            )}
          </div>
        ))}

      </div>
    </section>
  );
}
