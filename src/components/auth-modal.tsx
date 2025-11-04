"use client";

import { useState } from "react";
import { X } from "lucide-react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-brand-50 w-full max-w-md rounded-2xl shadow-xl p-6 relative animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center text-leaf-700">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-brand-700 mt-1 mb-6">
          {isRegister
            ? "Join Herbal Communities and enjoy natural wellness."
            : "Sign in to your account."}
        </p>

        <form
          onSubmit={(e) => {
            e.preventDefault();
          }}
          className="space-y-4"
        >
          {isRegister && (
            <input
              type="text"
              name="name"
              placeholder="Full Name"
              className="w-full rounded-lg border border-brand-200 p-2 focus:ring-2 focus:ring-leaf-500"
            />
          )}

          <input
            type="email"
            name="email"
            placeholder="Email Address"
            className="w-full rounded-lg border border-brand-200 p-2 focus:ring-2 focus:ring-leaf-500"
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            className="w-full rounded-lg border border-brand-200 p-2 focus:ring-2 focus:ring-leaf-500"
            required
          />

          <button
            type="submit"
            className="w-full bg-leaf-500 hover:bg-leaf-600 text-white font-medium py-2 rounded-lg transition"
          >
            {isRegister ? "Create Account" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-700 mt-4">
          {isRegister ? "Already have an account?" : "New to Herbal Communities?"}{" "}
          <button
            type="button"
            onClick={() => setIsRegister(!isRegister)}
            className="text-leaf-600 hover:underline font-medium"
          >
            {isRegister ? "Login" : "Create Account"}
          </button>
        </p>
      </div>
    </div>
  );
}
