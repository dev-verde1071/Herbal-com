export default function Loading() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <div className="w-14 h-14 border-4 border-jungle-500 border-t-transparent rounded-full animate-spin" />

        <p className="text-zinc-400 tracking-wide">
          Loading Herbal Communities...
        </p>
      </div>
    </div>
  );
}
