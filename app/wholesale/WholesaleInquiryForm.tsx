"use client";

import { useState } from "react";

export default function WholesaleInquiryForm() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formElement = e.currentTarget;

    setLoading(true);
    setSuccess(false);
    setError("");

    const formData = new FormData(formElement);

    const payload = {
      name: String(formData.get("name") || ""),
      business: String(formData.get("business") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      message: String(formData.get("message") || ""),
    };

    try {
      const res = await fetch("/api/wholesale", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || "Failed to submit wholesale application.");
        return;
      }

      setSuccess(true);
      formElement.reset();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
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

      {error && (
        <div className="mb-6 rounded-2xl bg-red-900/30 border border-red-700/40 p-4 text-red-300">
          {error}
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
            Email Used For This Account
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
