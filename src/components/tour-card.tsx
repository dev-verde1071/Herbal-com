export default function TourCard({ tour }: { tour: any }) {
  return (
    <div className="card p-4 text-center rounded-xl">
      {tour.image && (
        <img
          src={tour.image}
          alt={tour.name}
          className="rounded-md mb-3 mx-auto w-full h-48 object-cover"
        />
      )}
      <h3 className="text-lg font-semibold text-leaf-700">{tour.name}</h3>
      <p className="text-brand-700 text-sm mb-2">{tour.description}</p>
      <p className="font-medium text-leaf-800">{tour.price}</p>
      <button className="btn-accent mt-3 px-4 py-2 rounded-lg w-full">
        Book Now
      </button>
    </div>
  );
}
