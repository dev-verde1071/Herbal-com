"use client";

import { useState } from "react";

type Guest = {
  name: string;
  email?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  dietaryRestrictions?: string | null;
  medicalNotes?: string | null;
  travelNotes?: string | null;
  nearestAirportName?: string | null;
  nearestAirportCode?: string | null;
  intakeSubmitted: boolean;
};

export default function RetreatGuestIntakeForm({
  token,
  guest,
}: {
  token: string;
  guest: Guest;
}) {
  const [submitted, setSubmitted] = useState(guest.intakeSubmitted);
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name: guest.name || "",
    phone: guest.phone || "",
    emergencyContact: guest.emergencyContact || "",
    emergencyPhone: guest.emergencyPhone || "",
    dietaryRestrictions: guest.dietaryRestrictions || "",
    medicalNotes: guest.medicalNotes || "",
    travelNotes: guest.travelNotes || "",
    nearestAirportName: guest.nearestAirportName || "",
    nearestAirportCode: guest.nearestAirportCode || "",
  });

  function update(key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function submit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);

    const res = await fetch(`/api/retreat-guest/${token}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(form),
    });

    const data = await res.json().catch(() => null);

    setLoading(false);

    if (!res.ok) {
      alert(data?.error || "Failed to submit guest information.");
      return;
    }

    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="glass rounded-3xl p-10 border border-jungle-900/60 text-center">
        <p className="text-5xl mb-5">🌿</p>

        <h2 className="font-display text-4xl mb-4">
          Information Submitted
        </h2>

        <p className="text-zinc-300 leading-relaxed">
          Thank you. Your guest information has been submitted. Our team will
          reach out to confirm retreat details.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={submit}
      className="glass rounded-3xl p-8 border border-jungle-900/60 space-y-6"
    >
      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Guest Name
        </label>

        <input
          required
          value={form.name}
          onChange={(e) => update("name", e.target.value)}
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Phone Number
        </label>

        <input
          required
          value={form.phone}
          onChange={(e) => update("phone", e.target.value)}
          placeholder="Your best contact number"
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Emergency Contact Name
          </label>

          <input
            required
            value={form.emergencyContact}
            onChange={(e) => update("emergencyContact", e.target.value)}
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Emergency Contact Phone
          </label>

          <input
            required
            value={form.emergencyPhone}
            onChange={(e) => update("emergencyPhone", e.target.value)}
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-5">
        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Nearest Airport Name
          </label>

          <input
            required
            value={form.nearestAirportName}
            onChange={(e) => update("nearestAirportName", e.target.value)}
            placeholder="Example: Orlando International Airport"
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm text-zinc-300 mb-2">
            Airport Code
          </label>

          <input
            required
            value={form.nearestAirportCode}
            onChange={(e) =>
              update("nearestAirportCode", e.target.value.toUpperCase())
            }
            placeholder="Example: MCO"
            maxLength={5}
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Dietary Restrictions
        </label>

        <textarea
          rows={3}
          value={form.dietaryRestrictions}
          onChange={(e) => update("dietaryRestrictions", e.target.value)}
          placeholder="Food allergies, dietary needs, restrictions, preferences..."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Medical Notes
        </label>

        <textarea
          rows={3}
          value={form.medicalNotes}
          onChange={(e) => update("medicalNotes", e.target.value)}
          placeholder="Anything our team should know to support your safety and comfort."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Travel Notes
        </label>

        <textarea
          rows={3}
          value={form.travelNotes}
          onChange={(e) => update("travelNotes", e.target.value)}
          placeholder="Travel timing, airport plans, arrival concerns, or anything helpful."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />
      </div>

      <button
        disabled={loading}
        className="w-full rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 py-4 font-semibold transition"
      >
        {loading ? "Submitting..." : "Submit Guest Information"}
      </button>
    </form>
  );
}
