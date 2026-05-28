"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";

type ApplicationStatus = "PENDING" | "APPROVED" | "REJECTED";

type WholesaleApplication = {
  id: string;
  name: string;
  business: string;
  email: string;
  phone: string;
  message?: string | null;
  status: ApplicationStatus;
  adminNote?: string | null;
  archived?: boolean;
  outreachNeeded?: boolean;
  createdAt: string | Date;
};

type Props = {
  applications: WholesaleApplication[];
};

type Filter =
  | "PENDING"
  | "APPROVED"
  | "REJECTED"
  | "OUTREACH"
  | "ACTIVE"
  | "ARCHIVED"
  | "ALL";

export default function WholesaleApplicationManager({ applications }: Props) {
  const router = useRouter();

  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Filter>("PENDING");
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const filteredApplications = useMemo(() => {
    const q = search.toLowerCase().trim();

    return applications.filter((app) => {
      let matchesFilter = true;

      if (filter === "ACTIVE") matchesFilter = !app.archived;
      else if (filter === "ARCHIVED") matchesFilter = !!app.archived;
      else if (filter === "ALL") matchesFilter = true;
      else if (filter === "OUTREACH") {
        matchesFilter = !!app.outreachNeeded && !app.archived;
      } else {
        matchesFilter = app.status === filter && !app.archived;
      }

      const searchableText = [
        app.business,
        app.name,
        app.email,
        app.phone,
        app.message,
        app.status,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      const matchesSearch = !q || searchableText.includes(q);

      return matchesFilter && matchesSearch;
    });
  }, [applications, search, filter]);

  const counts = useMemo(() => {
    return {
      ALL: applications.length,
      ACTIVE: applications.filter((app) => !app.archived).length,
      ARCHIVED: applications.filter((app) => app.archived).length,
      OUTREACH: applications.filter(
        (app) => app.outreachNeeded && !app.archived
      ).length,
      PENDING: applications.filter(
        (app) => app.status === "PENDING" && !app.archived
      ).length,
      APPROVED: applications.filter(
        (app) => app.status === "APPROVED" && !app.archived
      ).length,
      REJECTED: applications.filter(
        (app) => app.status === "REJECTED" && !app.archived
      ).length,
    };
  }, [applications]);

  async function updateStatus(id: string, status: "APPROVED" | "REJECTED") {
    const confirmText =
      status === "APPROVED"
        ? "Approve this wholesale application and email the applicant?"
        : "Reject this wholesale application and email the applicant?";

    if (!confirm(confirmText)) return;

    setLoadingId(id);

    const res = await fetch(`/api/admin/wholesale/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });

    const data = await res.json();
    setLoadingId(null);

    if (!res.ok) {
      alert(data.error || "Failed to update application.");
      return;
    }

    router.refresh();
  }

  async function archiveApplication(id: string, archived: boolean) {
    const confirmText = archived
      ? "Archive this wholesale application?"
      : "Restore this wholesale application?";

    if (!confirm(confirmText)) return;

    setLoadingId(id);

    const res = await fetch(`/api/admin/wholesale/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ archived }),
    });

    const data = await res.json();
    setLoadingId(null);

    if (!res.ok) {
      alert(data.error || "Failed to update archive status.");
      return;
    }

    router.refresh();
  }

  async function updateOutreach(id: string, outreachNeeded: boolean) {
    setLoadingId(id);

    const res = await fetch(`/api/admin/wholesale/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ outreachNeeded }),
    });

    const data = await res.json();
    setLoadingId(null);

    if (!res.ok) {
      alert(data.error || "Failed to update outreach status.");
      return;
    }

    router.refresh();
  }

  async function deleteApplication(id: string) {
    if (
      !confirm(
        "Permanently delete this wholesale application? This cannot be undone."
      )
    ) {
      return;
    }

    setLoadingId(id);

    const res = await fetch(`/api/admin/wholesale/${id}`, {
      method: "DELETE",
    });

    const data = await res.json();
    setLoadingId(null);

    if (!res.ok) {
      alert(data.error || "Failed to delete application.");
      return;
    }

    router.refresh();
  }

  function statusBadge(status: ApplicationStatus) {
    if (status === "APPROVED") {
      return "bg-green-900/40 text-green-300 border-green-700/40";
    }

    if (status === "REJECTED") {
      return "bg-red-900/40 text-red-300 border-red-700/40";
    }

    return "bg-yellow-900/40 text-yellow-300 border-yellow-700/40";
  }

  const filters: Filter[] = [
    "PENDING",
    "OUTREACH",
    "APPROVED",
    "REJECTED",
    "ACTIVE",
    "ARCHIVED",
    "ALL",
  ];

  function filterLabel(filterValue: Filter) {
    if (filterValue === "OUTREACH") return "Outreach";
    return filterValue.charAt(0) + filterValue.slice(1).toLowerCase();
  }

  return (
    <div className="space-y-6">
      <div className="glass rounded-3xl p-6 border border-jungle-900/60">
        <div className="grid lg:grid-cols-[1fr_auto] gap-4 items-center">
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by business, customer name, email, phone number, message..."
            className="w-full rounded-2xl bg-black/20 border border-jungle-900/60 px-4 py-3 outline-none focus:border-jungle-500"
          />

          <button
            type="button"
            onClick={() => router.refresh()}
            className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
          >
            Refresh
          </button>
        </div>

        <div className="flex flex-wrap gap-3 mt-5">
          {filters.map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setFilter(status)}
              className={`rounded-xl px-4 py-2 text-sm font-semibold border transition ${
                filter === status
                  ? "bg-jungle-700 border-jungle-400 text-white"
                  : "bg-black/20 border-jungle-900/60 text-zinc-300 hover:bg-jungle-900/60"
              }`}
            >
              {filterLabel(status)}{" "}
              <span className="text-xs opacity-70">({counts[status]})</span>
            </button>
          ))}
        </div>

        <p className="text-zinc-500 text-sm mt-4">
          Showing {filteredApplications.length} of {applications.length} applications.
        </p>
      </div>

      {filteredApplications.length === 0 ? (
        <div className="glass rounded-3xl p-12 text-center text-zinc-400 border border-jungle-900/60">
          No wholesale applications found.
        </div>
      ) : (
        filteredApplications.map((app) => (
          <div
            key={app.id}
            className={`glass rounded-3xl p-8 border ${
              app.archived
                ? "border-zinc-800/80 opacity-70"
                : "border-jungle-900/60"
            }`}
          >
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3 mb-3">
                  <h2 className="font-display text-3xl">{app.business}</h2>

                  <span
                    className={`text-xs px-3 py-1 rounded-full border ${statusBadge(app.status)}`}
                  >
                    {app.status}
                  </span>

                  {app.outreachNeeded && !app.archived && (
                    <span className="text-xs px-3 py-1 rounded-full border border-blue-700/40 bg-blue-900/30 text-blue-300">
                      OUTREACH
                    </span>
                  )}

                  {app.archived && (
                    <span className="text-xs px-3 py-1 rounded-full border border-zinc-700 bg-zinc-900/50 text-zinc-300">
                      ARCHIVED
                    </span>
                  )}
                </div>

                <p className="text-xs text-zinc-500 mb-5">
                  Submitted {new Date(app.createdAt).toLocaleString()}
                </p>

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
                    <p className="leading-relaxed">
                      <strong>Message:</strong> {app.message}
                    </p>
                  )}
                </div>
              </div>

              <div className="lg:w-80 space-y-3">
                {!app.archived && app.status === "PENDING" && (
                  <>
                    <button
                      type="button"
                      disabled={loadingId === app.id}
                      onClick={() => updateStatus(app.id, "APPROVED")}
                      className="w-full rounded-2xl bg-green-700 hover:bg-green-600 disabled:opacity-50 px-5 py-3 text-sm font-semibold transition"
                    >
                      {loadingId === app.id ? "Sending..." : "Approve & Email"}
                    </button>

                    <button
                      type="button"
                      disabled={loadingId === app.id}
                      onClick={() => updateStatus(app.id, "REJECTED")}
                      className="w-full rounded-2xl bg-red-800 hover:bg-red-700 disabled:opacity-50 px-5 py-3 text-sm font-semibold transition"
                    >
                      {loadingId === app.id ? "Sending..." : "Reject & Email"}
                    </button>
                  </>
                )}

                {!app.archived && app.status !== "PENDING" && (
                  <div className="rounded-2xl bg-black/20 border border-jungle-900/60 p-4 text-sm text-zinc-400">
                    Marked{" "}
                    <span className="font-semibold text-white">
                      {app.status}
                    </span>
                    .
                  </div>
                )}

                {!app.archived && app.status === "APPROVED" && (
                  <button
                    type="button"
                    disabled={loadingId === app.id}
                    onClick={() =>
                      updateOutreach(app.id, !app.outreachNeeded)
                    }
                    className={`w-full rounded-2xl border px-5 py-3 text-sm font-semibold transition ${
                      app.outreachNeeded
                        ? "bg-blue-900/50 hover:bg-blue-900 border-blue-700 text-blue-200"
                        : "bg-black/30 hover:bg-blue-900/40 border-jungle-900/60 text-zinc-300"
                    }`}
                  >
                    {app.outreachNeeded
                      ? "Mark Outreach Done"
                      : "Mark Outreach Needed"}
                  </button>
                )}

                <button
                  type="button"
                  disabled={loadingId === app.id}
                  onClick={() => archiveApplication(app.id, !app.archived)}
                  className="w-full rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-5 py-3 text-sm font-semibold transition"
                >
                  {app.archived ? "Restore Application" : "Archive Application"}
                </button>

                <button
                  type="button"
                  disabled={loadingId === app.id}
                  onClick={() => deleteApplication(app.id)}
                  className="w-full rounded-2xl bg-red-950/70 hover:bg-red-900 border border-red-800/60 px-5 py-3 text-sm font-semibold text-red-200 transition"
                >
                  Delete Permanently
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  );
}
