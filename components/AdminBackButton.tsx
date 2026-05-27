"use client";

import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

export default function AdminBackButton() {
  const router = useRouter();

  return (
    <button
      type="button"
      onClick={() => router.back()}
      className="inline-flex items-center gap-2 rounded-xl bg-black/30 hover:bg-jungle-800/60 border border-jungle-900/60 px-4 py-2 text-sm font-semibold text-zinc-200 transition"
    >
      <ArrowLeft className="w-4 h-4" />
      Back
    </button>
  );
}
