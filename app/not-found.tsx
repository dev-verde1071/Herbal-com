import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="text-center max-w-xl">
        <p className="uppercase tracking-[0.4em] text-jungle-300 text-xs mb-4">
          404
        </p>

        <h1 className="font-display text-5xl mb-6">
          Page not found
        </h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          The page you are looking for may have been moved or no longer exists.
        </p>

        <Link
          href="/"
          className="inline-flex rounded-2xl bg-jungle-500 hover:bg-jungle-400 px-8 py-4 font-semibold transition"
        >
          Return Home
        </Link>
      </div>
    </div>
  );
}
