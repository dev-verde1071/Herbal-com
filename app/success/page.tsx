import Link from "next/link";

export default function SuccessPage() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center glass rounded-3xl p-10 border border-jungle-900/60">
        <span className="text-6xl block mb-6">
          🌿
        </span>

        <h1 className="font-display text-4xl mb-4">
          Thank you for your order!
        </h1>

        <p className="text-zinc-300 leading-relaxed mb-8">
          Your payment was completed successfully. A confirmation email will be
          sent to you shortly.
        </p>

        <Link
          href="/products"
          className="inline-flex rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-8 py-4 font-semibold transition"
        >
          Continue Shopping
        </Link>
      </div>
    </div>
  );
}
