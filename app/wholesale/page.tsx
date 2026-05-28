import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import WholesaleInquiryForm from "./WholesaleInquiryForm";

export default async function WholesalePage() {
  const { userId } = await auth();

  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              Wholesale
            </p>

            <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              Partner with Herbal Communities.
            </h1>

            <p className="text-zinc-300 leading-relaxed text-lg mb-6">
              Apply for wholesale access to purchase approved Herbal
              Communities products for your store, wellness practice, market,
              or natural goods business.
            </p>

            <div className="glass rounded-3xl p-6 border border-jungle-900/60 space-y-4 text-zinc-300">
              <p>• Wholesale product access after approval</p>
              <p>• Retail-ready herbs, oils, honey, sea moss, and wellness goods</p>
              <p>• Team follow-up by email and/or phone after approval</p>
              <p>• Wholesale account access tied to your login email</p>
            </div>

            {userId && (
              <Link
                href="/dashboard/wholesale"
                className="inline-flex mt-8 rounded-2xl bg-jungle-700 hover:bg-jungle-600 px-6 py-3 font-semibold transition"
              >
                View Wholesale Area
              </Link>
            )}
          </div>

          <div>
            {userId ? (
              <WholesaleInquiryForm />
            ) : (
              <div className="glass rounded-3xl p-8 border border-jungle-900/60 text-center">
                <h2 className="font-display text-3xl mb-4">
                  Create an Account First
                </h2>

                <p className="text-zinc-300 leading-relaxed mb-8">
                  Please create an account or sign in before submitting a
                  wholesale application. This lets us connect your approval to
                  your wholesale access.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Link
                    href="/sign-up"
                    className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition"
                  >
                    Create Account
                  </Link>

                  <Link
                    href="/sign-in"
                    className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
