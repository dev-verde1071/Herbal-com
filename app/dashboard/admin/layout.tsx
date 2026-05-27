import Link from "next/link";
import AdminBackButton from "@/components/AdminBackButton";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-jungle-gradient text-white">
      <div className="border-b border-jungle-900/60 bg-black/30">
        <div className="max-w-7xl mx-auto px-6 py-5 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-jungle-300">
              Herbal Communities
            </p>
            <h1 className="font-display text-2xl mt-1">
              Admin Dashboard
            </h1>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <AdminBackButton />

            <Link
              href="/dashboard/admin"
              className="rounded-xl bg-jungle-700 hover:bg-jungle-600 px-4 py-2 text-sm font-semibold transition"
            >
              Dashboard
            </Link>

            <Link
              href="/"
              className="rounded-xl bg-black/30 hover:bg-jungle-800/60 border border-jungle-900/60 px-4 py-2 text-sm font-semibold transition"
            >
              View Site
            </Link>
          </div>
        </div>
      </div>

      {children}
    </div>
  );
}
