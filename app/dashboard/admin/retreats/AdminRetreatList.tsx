"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { formatPrice } from "@/lib/utils";

type Props = {
  retreats: any[];
};

export default function AdminRetreatList({
  retreats,
}: Props) {
  const router = useRouter();

  async function deleteRetreat(id: string) {
    if (!confirm("Delete this retreat?")) {
      return;
    }

    await fetch(`/api/admin/retreats/${id}`, {
      method: "DELETE",
    });

    router.refresh();
  }

  return (
    <div className="glass rounded-3xl p-8 border border-jungle-900/60">
      <div className="flex items-center justify-between mb-8">
        <h2 className="font-display text-3xl">
          Retreat Listings
        </h2>

        <Link
          href="/dashboard/admin/retreats/new"
          className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition"
        >
          + New Retreat
        </Link>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full min-w-[850px]">
          <thead>
            <tr className="border-b border-jungle-900/60 text-left text-sm text-zinc-400">
              <th className="pb-4">Name</th>
              <th className="pb-4">Location</th>
              <th className="pb-4">Price</th>
              <th className="pb-4">Spots</th>
              <th className="pb-4">Status</th>
              <th className="pb-4">Actions</th>
            </tr>
          </thead>

          <tbody>
            {retreats.map((retreat) => (
              <tr
                key={retreat.id}
                className="border-b border-jungle-900/40"
              >
                <td className="py-5">
                  <div>
                    <p className="font-semibold text-white">
                      {retreat.name}
                    </p>

                    <p className="text-xs text-zinc-500 mt-1">
                      /retreats/{retreat.slug}
                    </p>
                  </div>
                </td>

                <td className="py-5 text-zinc-300">
                  {retreat.location || "—"}
                </td>

                <td className="py-5 text-zinc-300">
                  {formatPrice(retreat.price)}
                </td>

                <td className="py-5 text-zinc-300">
                  {retreat.spotsLeft}/{retreat.spots}
                </td>

                <td className="py-5">
                  {retreat.active ? (
                    <span className="text-green-400 text-sm">
                      Active
                    </span>
                  ) : (
                    <span className="text-red-400 text-sm">
                      Hidden
                    </span>
                  )}
                </td>

                <td className="py-5">
                  <div className="flex items-center gap-3">
                    <Link
                      href={`/dashboard/admin/retreats/${retreat.id}`}
                      className="text-jungle-300 hover:text-white text-sm"
                    >
                      Edit
                    </Link>

                    <button
                      onClick={() => deleteRetreat(retreat.id)}
                      className="text-red-400 hover:text-red-300 text-sm"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
