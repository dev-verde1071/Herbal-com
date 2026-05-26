"use client";
import { useState } from "react";
import { ShoppingBag, Loader2 } from "lucide-react";

type Props = { variantId: string; disabled?: boolean };

export default function CheckoutButton({ variantId, disabled }: Props) {
  const [loading, setLoading] = useState(false);
  const [error, setError]     = useState("");

  async function go() {
    setLoading(true); setError("");
    try {
      const res  = await fetch("/api/checkout", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ variantId }) });
      const data = await res.json();
      if (data.url) window.location.href = data.url;
      else { setError(data.error || "Checkout failed."); setLoading(false); }
    } catch {
      setError("Network error. Please try again.");
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <button onClick={go} disabled={loading || disabled}
        className="flex items-center justify-center gap-2 w-full bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold py-3.5 rounded-xl transition">
        {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ShoppingBag className="w-4 h-4" />}
        {loading ? "Redirecting to Stripe..." : "Buy Now"}
      </button>
      {error && <p className="text-red-400 text-sm text-center">{error}</p>}
    </div>
  );
}
