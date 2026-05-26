"use client";

import { useState } from "react";

export default function WholesaleInquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    setLoading(true);

    const formData = new FormData(e.currentTarget);

    const payload = {
      name: formData.get("name"),
      business: formData.get("business"),
      email: formData.get("email"),
      phone: formData.get("phone"),
      message: formData.get("message"),
    };

    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (res.ok) {
        setSuccess(true);
        e.currentTarget.reset();
      }
    } catch {}

    setLoading(false);
  }

  return (
    <div className="glass rounded-3xl p-8 border border-jungle-900/60">
      <h2 className="font-display text-3xl mb-6">
        Apply for Wholesale Access
      </h2>

      {success && (
        <div className="mb-6 rounded-2xl bg-green-900/30 border border-green-700/40 p-4 text-green-300">
          Application submitted successfully.
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-sm mb-2 text-zinc-300">
            Full Name
          </label>

          <input
            name="name"
            required
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-zinc-300">
            Business Name
          </label>

          <input
            name="business"
            required
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-zinc-300">
            Email
          </label>

          <input
            type="email"
            name="email"
            required
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-zinc-300">
            Phone
          </label>

          <input
            name="phone"
            required
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <div>
          <label className="block text-sm mb-2 text-zinc-300">
            Additional Details
          </label>

          <textarea
            name="message"
            rows={5}
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 py-4 font-semibold transition"
        >
          {loading ? "Submitting..." : "Submit Application"}
        </button>
      </form>
    </div>
  );
}
