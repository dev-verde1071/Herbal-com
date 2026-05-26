"use client";

export default function Error({
  error,
  reset,
}: {
  error: Error;
  reset: () => void;
}) {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-6">
      <div className="max-w-xl text-center">
        <p className="uppercase tracking-[0.4em] text-red-400 text-xs mb-4">
          Error
        </p>

        <h1 className="font-display text-4xl mb-4">
          Something went wrong
        </h1>

        <p className="text-zinc-400 mb-8 leading-relaxed">
          {error.message || "Unexpected application error."}
        </p>

        <button
          onClick={() => reset()}
          className="rounded-2xl bg-jungle-500 hover:bg-jungle-400 px-8 py-4 font-semibold transition"
        >
          Try Again
        </button>
      </div>
    </div>
  );
}
