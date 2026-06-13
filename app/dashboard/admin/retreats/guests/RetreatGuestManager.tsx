"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type Guest = {
  id: string;
  name: string;
  email?: string | null;
  phone?: string | null;
  emergencyContact?: string | null;
  emergencyPhone?: string | null;
  nearestAirportName?: string | null;
  nearestAirportCode?: string | null;
  dietaryRestrictions?: string | null;
  medicalNotes?: string | null;
  travelNotes?: string | null;
  adminNotes?: string | null;
  status: string;
  createdAt: string | Date;
  retreat?: {
    name?: string | null;
    location?: string | null;
    startDate?: string | Date | null;
  } | null;
  order?: {
    id: string;
    total: number;
    status: string;
  } | null;
};

export default function RetreatGuestManager({ guests }: { guests: Guest[] }) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeReason, setRemoveReason] = useState<Record<string, string>>({});
  const [drafts, setDrafts] = useState<Record<string, Guest>>({});

  const filteredGuests = useMemo(() => {
    const q = search.toLowerCase().trim();

    return guests.filter((guest) => {
      const blob = [
        guest.name,
        guest.email,
        guest.phone,
        guest.emergencyContact,
        guest.emergencyPhone,
        guest.nearestAirportName,
        guest.nearestAirportCode,
        guest.dietaryRestrictions,
        guest.medicalNotes,
        guest.travelNotes,
        guest.adminNotes,
        guest.status,
        guest.retreat?.name,
        guest.retreat?.location,
        guest.order?.id,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return !q || blob.includes(q);
    });
  }, [guests, search]);

  function startEditing(guest: Guest) {
    setEditingId(guest.id);
    setDrafts((prev) => ({
      ...prev,
      [guest.id]: { ...guest },
    }));
  }

  function updateDraft(id: string, key: keyof Guest, value: string) {
    setDrafts((prev) => ({
      ...prev,
      [id]: {
        ...prev[id],
        [key]: value,
      },
    }));
  }

  async function saveGuest(id: string) {
    const draft = drafts[id];

    if (!draft) return;

    setSavingId(id);

    const res = await fetch(`/api/admin/retreat-guests/${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(draft),
    });

    const data = await res.json().catch(() => null);

    setSavingId(null);

    if (!res.ok) {
      alert(data?.error || "Failed to save guest.");
      return;
    }

    setEditingId(null);
    router.refresh();
  }

  async function removeGuest(id: string) {
    const reason = String(removeReason[id] || "").trim();

    if (!reason) {
      alert("Please enter a reason before removing this guest.");
      return;
    }

    const confirmed = confirm(
      "This will remove the guest, issue a Stripe refund, reopen one retreat spot, and email the guest. Continue?"
    );

    if (!confirmed) return;

    setRemovingId(id);

    const res = await fetch(`/api/admin/retreat-guests/${id}/remove`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ reason }),
    });

    const data = await res.json().catch(() => null);

    setRemovingId(null);

    if (!res.ok) {
      alert(data?.error || "Failed to remove guest.");
      return;
    }

    alert("Guest removed, refund created, and email sent.");
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search guests by name, email, phone, retreat, order, notes, or status..."
          className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
        />

        <p className="text-zinc-500 text-sm mt-4">
          Showing {filteredGuests.length} of {guests.length} guests.
        </p>
      </div>

      {filteredGuests.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No retreat guests found.
        </div>
      ) : (
        <div className="space-y-6">
          {filteredGuests.map((guest) => {
            const isEditing = editingId === guest.id;
            const draft = drafts[guest.id] || guest;
            const removed = guest.status === "REMOVED_REFUNDED";

            return (
              <div
                key={guest.id}
                className={`glass rounded-3xl p-6 border ${
                  removed
                    ? "border-red-900/60 opacity-75"
                    : "border-jungle-900/60"
                }`}
              >
                <div className="flex flex-col xl:flex-row xl:items-start xl:justify-between gap-6">
                  <div className="flex-1">
                    <p className="uppercase tracking-[0.25em] text-jungle-300 text-xs mb-3">
                      Retreat Guest
                    </p>

                    {isEditing ? (
                      <input
                        value={draft.name || ""}
                        onChange={(e) =>
                          updateDraft(guest.id, "name", e.target.value)
                        }
                        className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 text-2xl font-semibold outline-none focus:border-jungle-500"
                      />
                    ) : (
                      <h2 className="font-display text-3xl">{guest.name}</h2>
                    )}

                    <p className="text-zinc-500 text-sm mt-2">
                      {guest.retreat?.name || "Retreat"} ·{" "}
                      {guest.retreat?.startDate
                        ? new Date(guest.retreat.startDate).toLocaleDateString()
                        : "Date TBD"}
                    </p>

                    <p className="text-zinc-500 text-sm mt-1">
                      Created {new Date(guest.createdAt).toLocaleString()}
                    </p>

                    <div className="grid md:grid-cols-2 gap-4 mt-6">
                      {[
                        ["email", "Email"],
                        ["phone", "Phone"],
                        ["emergencyContact", "Emergency Contact"],
                        ["emergencyPhone", "Emergency Phone"],
                        ["nearestAirportName", "Nearest Airport"],
                        ["nearestAirportCode", "Airport Code"],
                        ["status", "Status"],
                      ].map(([key, label]) => (
                        <div key={key}>
                          <label className="block text-xs text-zinc-500 mb-1">
                            {label}
                          </label>

                          {isEditing ? (
                            <input
                              value={(draft as any)[key] || ""}
                              onChange={(e) =>
                                updateDraft(
                                  guest.id,
                                  key as keyof Guest,
                                  e.target.value
                                )
                              }
                              className="w-full rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2 outline-none focus:border-jungle-500"
                            />
                          ) : (
                            <p className="text-zinc-300">
                              {(guest as any)[key] || "—"}
                            </p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="xl:w-[500px] space-y-4">
                    {[
                      ["dietaryRestrictions", "Dietary Restrictions"],
                      ["medicalNotes", "Medical Notes"],
                      ["travelNotes", "Travel Notes"],
                      ["adminNotes", "Admin Notes"],
                    ].map(([key, label]) => (
                      <div
                        key={key}
                        className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4"
                      >
                        <label className="block text-sm font-semibold text-jungle-300 mb-2">
                          {label}
                        </label>

                        {isEditing ? (
                          <textarea
                            rows={3}
                            value={(draft as any)[key] || ""}
                            onChange={(e) =>
                              updateDraft(
                                guest.id,
                                key as keyof Guest,
                                e.target.value
                              )
                            }
                            className="w-full rounded-xl bg-black/20 border border-jungle-900/60 px-3 py-2 outline-none focus:border-jungle-500"
                          />
                        ) : (
                          <p className="text-sm text-zinc-300 whitespace-pre-line">
                            {(guest as any)[key] || "—"}
                          </p>
                        )}
                      </div>
                    ))}

                    <div className="flex flex-wrap gap-3">
                      {isEditing ? (
                        <>
                          <button
                            type="button"
                            disabled={savingId === guest.id}
                            onClick={() => saveGuest(guest.id)}
                            className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-6 py-3 font-semibold transition"
                          >
                            {savingId === guest.id ? "Saving..." : "Save Guest"}
                          </button>

                          <button
                            type="button"
                            onClick={() => setEditingId(null)}
                            className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <button
                          type="button"
                          onClick={() => startEditing(guest)}
                          disabled={removed}
                          className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 disabled:opacity-50 px-6 py-3 font-semibold transition"
                        >
                          Edit Guest
                        </button>
                      )}
                    </div>

                    {!removed && (
                      <div className="rounded-2xl bg-red-950/30 border border-red-900/60 p-4">
                        <h3 className="font-semibold text-red-300 mb-2">
                          Remove Guest & Issue Refund
                        </h3>

                        <p className="text-sm text-zinc-400 mb-3">
                          Enter the reason for removing this guest. This reason
                          will be emailed to the guest and a refund will be
                          issued through Stripe.
                        </p>

                        <textarea
                          rows={4}
                          value={removeReason[guest.id] || ""}
                          onChange={(e) =>
                            setRemoveReason((prev) => ({
                              ...prev,
                              [guest.id]: e.target.value,
                            }))
                          }
                          placeholder="Reason for removing guest..."
                          className="w-full rounded-xl bg-black/20 border border-red-900/60 px-3 py-2 outline-none focus:border-red-500"
                        />

                        <button
                          type="button"
                          onClick={() => removeGuest(guest.id)}
                          disabled={removingId === guest.id}
                          className="mt-3 w-full rounded-2xl bg-red-800 hover:bg-red-700 disabled:opacity-50 px-6 py-3 font-semibold transition"
                        >
                          {removingId === guest.id
                            ? "Removing & Refunding..."
                            : "Remove Guest, Refund, and Email"}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
