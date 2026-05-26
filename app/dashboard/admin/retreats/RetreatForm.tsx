"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type RetreatFormData = {
  id?: string;
  name: string;
  description?: string | null;
  location?: string | null;
  country?: string | null;
  duration?: string | null;
  price: number | string;
  spots: number | string;
  spotsLeft: number | string;
  images: string[];
  featured: boolean;
  startDate?: string | null;
  endDate?: string | null;
  includes: string[];
  active: boolean;
};

export default function RetreatForm({
  retreat,
}: {
  retreat?: RetreatFormData;
}) {
  const router = useRouter();

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState<RetreatFormData>(
    retreat || {
      name: "",
      description: "",
      location: "",
      country: "",
      duration: "",
      price: "",
      spots: 0,
      spotsLeft: 0,
      images: [],
      featured: false,
      startDate: "",
      endDate: "",
      includes: [],
      active: true,
    }
  );

  const [imageText, setImageText] = useState(
    retreat?.images?.join("\n") || ""
  );

  const [includesText, setIncludesText] = useState(
    retreat?.includes?.join("\n") || ""
  );

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const payload = {
      ...form,
      price: Number(form.price || 0),
      spots: Number(form.spots || 0),
      spotsLeft: Number(form.spotsLeft || 0),
      images: imageText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
      includes: includesText
        .split("\n")
        .map((x) => x.trim())
        .filter(Boolean),
    };

    const url = retreat?.id
      ? `/api/admin/retreats/${retreat.id}`
      : "/api/admin/retreats";

    const method = retreat?.id ? "PUT" : "POST";

    const res = await fetch(url, {
      method,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (res.ok) {
      router.push("/dashboard/admin/retreats");
      router.refresh();
    } else {
      alert("Failed to save retreat.");
    }
  }

  return (
    <form
      onSubmit={submit}
      className="glass rounded-3xl p-8 border border-jungle-900/60 space-y-8"
    >
      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Retreat Name
          </label>

          <input
            required
            value={form.name}
            onChange={(e) =>
              setForm({
                ...form,
                name: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Location
          </label>

          <input
            value={form.location || ""}
            onChange={(e) =>
              setForm({
                ...form,
                location: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Country
          </label>

          <input
            value={form.country || ""}
            onChange={(e) =>
              setForm({
                ...form,
                country: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Duration
          </label>

          <input
            placeholder="Example: 7 days / 6 nights"
            value={form.duration || ""}
            onChange={(e) =>
              setForm({
                ...form,
                duration: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Description
        </label>

        <textarea
          rows={5}
          value={form.description || ""}
          onChange={(e) =>
            setForm({
              ...form,
              description: e.target.value,
            })
          }
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Price
          </label>

          <input
            required
            type="number"
            step="0.01"
            value={form.price}
            onChange={(e) =>
              setForm({
                ...form,
                price: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Total Spots
          </label>

          <input
            type="number"
            value={form.spots}
            onChange={(e) =>
              setForm({
                ...form,
                spots: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Spots Left
          </label>

          <input
            type="number"
            value={form.spotsLeft}
            onChange={(e) =>
              setForm({
                ...form,
                spotsLeft: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Start Date
          </label>

          <input
            type="date"
            value={form.startDate || ""}
            onChange={(e) =>
              setForm({
                ...form,
                startDate: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            End Date
          </label>

          <input
            type="date"
            value={form.endDate || ""}
            onChange={(e) =>
              setForm({
                ...form,
                endDate: e.target.value,
              })
            }
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Image URLs, one per line
        </label>

        <textarea
          rows={4}
          value={imageText}
          onChange={(e) => setImageText(e.target.value)}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Includes, one per line
        </label>

        <textarea
          rows={4}
          value={includesText}
          onChange={(e) => setIncludesText(e.target.value)}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div className="flex flex-wrap gap-8">
        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) =>
              setForm({
                ...form,
                active: e.target.checked,
              })
            }
          />

          <span className="text-sm text-zinc-300">
            Active
          </span>
        </label>

        <label className="flex items-center gap-3">
          <input
            type="checkbox"
            checked={form.featured}
            onChange={(e) =>
              setForm({
                ...form,
                featured: e.target.checked,
              })
            }
          />

          <span className="text-sm text-zinc-300">
            Featured
          </span>
        </label>
      </div>

      <button
        disabled={loading}
        className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-8 py-4 font-semibold"
      >
        {loading ? "Saving..." : "Save Retreat"}
      </button>
    </form>
  );
}
