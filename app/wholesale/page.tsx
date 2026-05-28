import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import WholesaleInquiryForm from "./WholesaleInquiryForm";

export default function WholesalePage() {
  return (
    <div className="min-h-screen py-16 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid lg:grid-cols-2 gap-12 items-start">
          <div>
            <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
              Wholesale Program
            </p>

            <h1 className="font-display text-5xl md:text-6xl leading-tight mb-6">
              Bulk Herbal Partnerships
            </h1>

            <p className="text-zinc-300 leading-relaxed text-lg mb-10">
              Apply for wholesale access to premium herbal products, sea moss,
              stingless bee honey, oils, and wellness goods sourced directly
              from trusted communities.
            </p>

            <div className="glass rounded-3xl p-8 border border-jungle-900/60 mb-6">
              <h2 className="text-xl font-semibold text-jungle-300 mb-5">
                Wholesale Benefits
              </h2>

              <div className="space-y-4 text-zinc-300">
                <p>• Bulk pricing discounts</p>
                <p>• Private labeling opportunities</p>
                <p>• Access to limited inventory</p>
                <p>• Large quantity sea moss ordering</p>
                <p>• Melipona honey wholesale access</p>
              </div>
            </div>

            <div className="glass rounded-3xl p-8 border border-jungle-900/60">
              <h2 className="text-xl font-semibold text-jungle-300 mb-5">
                How It Works
              </h2>

              <div className="space-y-4 text-zinc-300">
                <p>1. Create an account or sign in.</p>
                <p>2. Submit your wholesale application.</p>
                <p>3. Our team reviews your request.</p>
                <p>4. If approved, you receive wholesale access.</p>
                <p>5. A team member follows up by email and/or phone.</p>
              </div>
            </div>
          </div>

          <div>
            <SignedIn>
              <WholesaleInquiryForm />

              <div className="mt-6 text-center">
                <Link
                  href="/dashboard/wholesale"
                  className="inline-flex rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition"
                >
                  View Wholesale Area
                </Link>
              </div>
            </SignedIn>

            <SignedOut>
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
                  <SignUpButton mode="modal">
                    <button className="rounded-2xl bg-jungle-600 hover:bg-jungle-500 px-6 py-3 font-semibold transition">
                      Create Account
                    </button>
                  </SignUpButton>

                  <SignInButton mode="modal">
                    <button className="rounded-2xl bg-black/30 hover:bg-jungle-900/60 border border-jungle-900/60 px-6 py-3 font-semibold transition">
                      Sign In
                    </button>
                  </SignInButton>
                </div>
              </div>
            </SignedOut>
          </div>
        </div>
      </div>
    </div>
  );
}
