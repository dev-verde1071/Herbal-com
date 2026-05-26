"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

type Props = {
  applications: any[];
};

export default function WholesaleApplicationManager({
  applications,
}: Props) {
  const router = useRouter();

  const [notes, setNotes] = useState<Record<string, string>>({});

  async function updateStatus(
    id: string,
    status: "APPROVED" | "REJECTED" | "PENDING"
  ) {
    const res = await fetch(`/api/admin/wholesale/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        status,
        adminNote: notes[id] || "",
      }),
    });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Failed to update application.");
    }
  }

  return (
    <div className="space-y-6">
      {applications.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400">
          No wholesale applications yet.
        </div>
      ) : (
        applications.map((app) => (
          <div
            key={app.id}
            className="glass rounded-3xl p-8 border border-jungle-900/60"
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <h2 className="font-display text-3xl">
                    {app.business}
                  </h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full ${
                      app.status === "APPROVED"
                        ? "bg-green-900/40 text-green-300"
                        : app.status === "REJECTED"
                        ? "bg-red-900/40 text-red-300"
                        : "bg-yellow-900/40 text-yellow-300"
                    }`}
                  >
                    {app.status}
                  </span>
                </div>

                <div className="space-y-2 text-sm text-zinc-300">
                  <p>
                    <strong>Name:</strong> {app.name}
                  </p>

                  <p>
                    <strong>Email:</strong> {app.email}
                  </p>

                  <p>
                    <strong>Phone:</strong> {app.phone}
                  </p>

                  {app.message && (
                    <p>
                      <strong>Message:</strong> {app.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="lg:w-96 space-y-4">
                <textarea
                  rows={4}
                  placeholder="Admin note"
                  value={notes[app.id] ?? app.adminNote ?? ""}
                  onChange={(e) =>
                    setNotes({
                      ...notes,
                      [app.id]: e.target.value,
                    })
                  }
                  className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
                />

                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={() => updateStatus(app.id, "APPROVED")}
                    className="rounded-xl bg-green-700 hover:bg-green-600 px-4 py-2 text-sm font-semibold"
                  >
                    Approve
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "REJECTED")}
                    className="rounded-xl bg-red-800 hover:bg-red-700 px-4 py-2 text-sm font-semibold"
                  >
                    Reject
                  </button>

                  <button
                    onClick={() => updateStatus(app.id, "PENDING")}
                    className="rounded-xl bg-zinc-800 hover:bg-zinc-700 px-4 py-2 text-sm font-semibold"
                  >
                    Pending
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
