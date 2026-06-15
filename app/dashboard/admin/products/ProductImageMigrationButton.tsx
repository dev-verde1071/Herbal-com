"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type MigrationStats = {
  productsScanned: number;
  variantsScanned: number;
  productsUpdated: number;
  variantsUpdated: number;
  imagesConverted: number;
  imagesUploaded: number;
  imagesReused: number;
  imagesFailed: number;
  errors: string[];
};

export default function ProductImageMigrationButton() {
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [stats, setStats] = useState<MigrationStats | null>(null);
  const [error, setError] = useState("");

  async function runMigration() {
    const confirmed = window.confirm(
      "Convert existing retail product images to UploadThing URLs? This will update old base64 images in Neon."
    );

    if (!confirmed) return;

    setLoading(true);
    setMessage("");
    setError("");
    setStats(null);

    try {
      const res = await fetch("/api/admin/products/migrate-images", {
        method: "POST",
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.error || "Image migration failed.");
      }

      setMessage(data.message || "Image migration complete.");
      setStats(data.stats || null);
      router.refresh();
    } catch (err: any) {
      setError(err?.message || "Image migration failed.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="w-full md:w-auto">
      <button
        type="button"
        onClick={runMigration}
        disabled={loading}
        className="w-full md:w-auto rounded-2xl border border-amber-600/60 bg-amber-900/30 hover:bg-amber-800/40 disabled:opacity-60 disabled:cursor-not-allowed px-6 py-3 font-semibold text-amber-100 transition"
      >
        {loading ? "Converting Images..." : "Convert Existing Images"}
      </button>

      {(message || error || stats) && (
        <div className="mt-3 rounded-2xl border border-jungle-900/60 bg-black/30 p-4 text-sm">
          {message && <p className="text-green-300">{message}</p>}
          {error && <p className="text-red-300">{error}</p>}

          {stats && (
            <div className="mt-3 grid grid-cols-2 gap-2 text-zinc-400">
              <p>Products scanned: {stats.productsScanned}</p>
              <p>Variants scanned: {stats.variantsScanned}</p>
              <p>Products updated: {stats.productsUpdated}</p>
              <p>Variants updated: {stats.variantsUpdated}</p>
              <p>Images converted: {stats.imagesConverted}</p>
              <p>Images uploaded: {stats.imagesUploaded}</p>
              <p>Images reused: {stats.imagesReused}</p>
              <p>Images failed: {stats.imagesFailed}</p>
            </div>
          )}

          {stats?.errors?.length ? (
            <div className="mt-3 text-red-300">
              <p className="font-semibold">Errors:</p>
              <ul className="mt-1 list-disc pl-5 space-y-1">
                {stats.errors.map((item, index) => (
                  <li key={`${item}-${index}`}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      )}
    </div>
  );
}
