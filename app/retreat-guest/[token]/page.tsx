export const dynamic = "force-dynamic";

import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import RetreatGuestIntakeForm from "./RetreatGuestIntakeForm";

export default async function RetreatGuestIntakePage({
  params,
}: {
  params: Promise<{ token: string }>;
}) {
  const { token } = await params;

  const guest = await db.retreatGuest.findFirst({
    where: {
      intakeToken: token,
    },
    include: {
      retreat: true,
    },
  });

  if (!guest) return notFound();

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-3xl mx-auto">
        <div className="mb-10 text-center">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Retreat Guest Information
          </p>

          <h1 className="font-display text-5xl">
            Complete Your Guest Details
          </h1>

          <p className="text-zinc-400 mt-4">
            {guest.retreat?.name
              ? `For ${guest.retreat.name}`
              : "Please submit your retreat guest details."}
          </p>
        </div>

        <RetreatGuestIntakeForm
          token={token}
          guest={{
            name: guest.name,
            email: guest.email,
            phone: guest.phone,
            emergencyContact: guest.emergencyContact,
            emergencyPhone: guest.emergencyPhone,
            dietaryRestrictions: guest.dietaryRestrictions,
            medicalNotes: guest.medicalNotes,
            travelNotes: guest.travelNotes,
            nearestAirportName: guest.nearestAirportName,
            nearestAirportCode: guest.nearestAirportCode,
            intakeSubmitted: guest.intakeSubmitted,
          }}
        />
      </div>
    </div>
  );
}
