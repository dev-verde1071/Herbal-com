"use client";

import Link from "next/link";
import { SignedIn, SignedOut, SignInButton, SignUpButton } from "@clerk/nextjs";
import WholesaleInquiryForm from "./WholesaleInquiryForm";

export default function WholesaleAccessPanel() {
  return (
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
            Please create an account or sign in before submitting a wholesale
            application. This lets us connect your approval to your wholesale
            access.
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
  );
}
