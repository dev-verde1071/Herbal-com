export default function Team() {
  return (
    <section className="max-w-4xl mx-auto space-y-8">
      <h2 className="text-4xl font-bold text-leaf-600">Meet Our Team</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded shadow text-center">
          <div className="w-24 h-24 bg-leaf-50 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Thomas Scott</h3>
          <p className="text-sm">Founder, Herbalist, & Medicine Man</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <div className="w-24 h-24 bg-leaf-50 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Aaron Bloom</h3>
          <p className="text-sm">Logistics Director</p>
        </div>

        <div className="bg-white p-6 rounded shadow text-center">
          <div className="w-24 h-24 bg-leaf-50 rounded-full mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Luke DeYesso</h3>
          <p className="text-sm">Web Developer</p>
        </div>
      </div>
    </section>
  );
}
