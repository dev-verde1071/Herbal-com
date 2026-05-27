"use client";

import { useEffect, useState } from "react";

type Banner = {
  text: string;
  active: boolean;
  color: string;
  bgColor: string;
  emoji?: string;
  speedSeconds?: number;
};

export default function ClearanceBanner() {
  const [banner, setBanner] = useState<Banner | null>(null);

  useEffect(() => {
    fetch("/api/admin/banner")
      .then((res) => res.json())
      .then((data) => setBanner(data))
      .catch(() => null);
  }, []);

  if (!banner || !banner.active) return null;

  const emoji = banner.emoji || "🌿";
  const speed = banner.speedSeconds || 90;

  return (
    <div
      className="relative overflow-hidden border-b border-amber-500/20"
      style={{ backgroundColor: banner.bgColor }}
    >
      <div
        className="marquee-track py-2"
        style={{ animationDuration: `${speed}s` }}
      >
        {Array.from({ length: 10 }).map((_, i) => (
          <div
            key={i}
            className="flex items-center gap-3 px-8 text-xs uppercase tracking-[0.25em] whitespace-nowrap"
            style={{ color: banner.color }}
          >
            {emoji} {banner.text} •
          </div>
        ))}
      </div>
    </div>
  );
}
