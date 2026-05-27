"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Banner = {
  id?: string;
  text: string;
  active: boolean;
  color: string;
  bgColor: string;
  emoji: string;
  speedSeconds: number;
};

const emojis = ["🌿", "🍯", "🌊", "🍄", "✨", "🌺", "🥥", "🫙", "📢", "🔥"];

export default function BannerManager({ banner }: { banner: Banner | null }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<Banner>(
    banner || {
      text: "Free shipping on select herbal products this week.",
      active: true,
      color: "#c89f4f",
      bgColor: "#1a3a22",
      emoji: "🌿",
      speedSeconds: 90,
    }
  );

  async function save() {
    setLoading(true);

    const res = await fetch("/api/admin/banner", {
      method: form.id ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });

    setLoading(false);

    if (res.ok) {
      router.refresh();
      alert("Banner saved.");
    } else {
      alert("Failed to save banner.");
    }
  }

  return (
    <div className="glass rounded-3xl p-8 border border-jungle-900/60 space-y-8">
      <div>
        <label className="block text-sm text-zinc-300 mb-2">Banner Text</label>
        <textarea
          rows={4}
          value={form.text}
          onChange={(e) => setForm({ ...form, text: e.target.value })}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-3">Choose Emoji</label>
        <div className="flex flex-wrap gap-3">
          {emojis.map((emoji) => (
            <button
              key={emoji}
              type="button"
              onClick={() => setForm({ ...form, emoji })}
              className={`text-2xl rounded-xl px-4 py-3 border ${
                form.emoji === emoji
                  ? "border-jungle-400 bg-jungle-800"
                  : "border-jungle-900/60 bg-black/20"
              }`}
            >
              {emoji}
            </button>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Banner Speed: {form.speedSeconds}s
        </label>
        <input
          type="range"
          min="20"
          max="180"
          step="5"
          value={form.speedSeconds}
          onChange={(e) =>
            setForm({ ...form, speedSeconds: Number(e.target.value) })
          }
        />
        <p className="text-xs text-zinc-500 mt-2">
          Higher number = slower banner. Recommended: 90–120.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">Text Color</label>
          <input
            type="color"
            value={form.color}
            onChange={(e) => setForm({ ...form, color: e.target.value })}
            className="h-12 w-full rounded-2xl bg-black/20 border border-jungle-900/60"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Background Color
          </label>
          <input
            type="color"
            value={form.bgColor}
            onChange={(e) => setForm({ ...form, bgColor: e.target.value })}
            className="h-12 w-full rounded-2xl bg-black/20 border border-jungle-900/60"
          />
        </div>
      </div>

      <label className="flex items-center gap-3">
        <input
          type="checkbox"
          checked={form.active}
          onChange={(e) => setForm({ ...form, active: e.target.checked })}
        />
        <span className="text-sm text-zinc-300">Active</span>
      </label>

      <div
        className="rounded-2xl px-6 py-4 text-center text-sm font-semibold overflow-hidden"
        style={{ color: form.color, backgroundColor: form.bgColor }}
      >
        {form.emoji} {form.text || "Banner preview text"} •
      </div>

      <button
        onClick={save}
        disabled={loading}
        className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-8 py-4 font-semibold"
      >
        {loading ? "Saving..." : "Save Banner"}
      </button>
    </div>
  );
}
