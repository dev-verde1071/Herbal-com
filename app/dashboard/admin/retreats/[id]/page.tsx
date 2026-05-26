import { redirect, notFound } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import RetreatForm from "../RetreatForm";

export default async function EditRetreatPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const { id } = await params;

  const retreat = await db.retreat.findUnique({
    where: { id },
  });

  if (!retreat) {
    return notFound();
  }

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Edit Retreat
          </h1>
        </div>

        <RetreatForm retreat={retreat as any} />
      </div>
    </div>
  );
}
