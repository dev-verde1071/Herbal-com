const reviews = [
  {
    name: "Alicia M.",
    text: "The sea moss quality was amazing. You can tell this is not generic store-bought product.",
  },
  {
    name: "Jordan R.",
    text: "The honey is rich, unique, and unlike anything I have tried before.",
  },
  {
    name: "Maya T.",
    text: "Beautiful mission and great products. I love that the sourcing supports real communities.",
  },
];

export default function ReviewsPage() {
  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
          Customer Reviews
        </p>

        <h1 className="font-display text-5xl md:text-6xl mb-12">
          What People Are Saying
        </h1>

        <div className="grid md:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.name}
              className="glass rounded-3xl p-8 border border-jungle-900/60"
            >
              <div className="text-amber-300 text-xl mb-4">
                ★★★★★
              </div>

              <p className="text-zinc-300 leading-relaxed mb-6">
                “{review.text}”
              </p>

              <p className="font-semibold text-white">
                {review.name}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
