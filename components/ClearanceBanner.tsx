"use client";

const BANNER_SPEED_SECONDS = 90; // higher = slower, lower = faster

export default function ClearanceBanner() {
  return (
    <div className="relative overflow-hidden border-b border-amber-500/20 bg-gradient-to-r from-amber-950/70 via-amber-900/50 to-amber-950/70">
      <div
        className="marquee-track py-2"
        style={{
          animationDuration: `${BANNER_SPEED_SECONDS}s`,
        }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 text-xs uppercase tracking-[0.25em] text-amber-300 whitespace-nowrap"
          >
            🌿 Herbal Communities • Rare Herbs • Retreats • Premium Sea Moss •
            Melipona Honey •
          </div>
        ))}
      </div>
    </div>
  );
}
