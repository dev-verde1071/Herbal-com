export default function ReviewCard({ review }: { review: any }) {
  return (
    <div className="card rounded-xl p-4 text-left">
      <div className="flex justify-between items-center mb-1">
        <p className="font-medium text-leaf-700">{review.name}</p>
        <p className="text-yellow-600 text-sm">
          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
        </p>
      </div>
      <p className="text-brand-800 text-sm">{review.body}</p>
    </div>
  );
}
