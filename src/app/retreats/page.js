export default function Retreats() {
  return (
    <section className="max-w-4xl mx-auto space-y-12">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-4xl font-bold text-leaf-600">Healing Retreats</h1>
        <p className="text-brand-700 mt-2">
          Transformative experiences in nature guided by holistic practitioners.
        </p>
      </div>

      {/* Retreat Sections */}
      <div className="space-y-10">

        {/* RETREAT 1 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-leaf-600">
            Mountain Herbal Healing Retreat
          </h2>
          <p className="mt-2 text-gray-700">
            A 3-day immersive retreat in the mountains, blending meditation,
            herbal workshops, nature walks, and detox rituals.
          </p>

          <button className="mt-4 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            Learn More
          </button>
        </div>

        {/* RETREAT 2 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-leaf-600">
            Sacred Plant Medicine Weekend
          </h2>
          <p className="mt-2 text-gray-700">
            Explore the ancient traditions of plant medicine in a safe guided environment.
            Includes ceremony, integration sessions, and grounding practices.
          </p>

          <button className="mt-4 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            Learn More
          </button>
        </div>

        {/* RETREAT 3 */}
        <div className="bg-white p-6 rounded shadow">
          <h2 className="text-2xl font-semibold text-leaf-600">
            Coastal Wellness Reset Retreat
          </h2>
          <p className="mt-2 text-gray-700">
            A calming oceanside retreat focused on herbal detox, breathwork,
            ocean meditation, and full-body recovery.
          </p>

          <button className="mt-4 px-4 py-2 bg-leaf-500 text-white rounded hover:bg-leaf-600">
            Learn More
          </button>
        </div>

      </div>
    </section>
  );
}
