"use client";

import { X } from "lucide-react";
import { useState } from "react";

export default function AuthModal({ onClose }: { onClose: () => void }) {
  const [isRegister, setIsRegister] = useState(false);

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm">
      <div className="bg-brand-50 p-6 rounded-2xl shadow-xl relative w-full max-w-md animate-fadeIn">
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-600 hover:text-gray-800"
        >
          <X className="w-5 h-5" />
        </button>

        <h2 className="text-2xl font-bold text-center text-leaf-700 mb-2">
          {isRegister ? "Create Account" : "Welcome Back"}
        </h2>
        <p className="text-center text-brand-700 mb-6">
          {isRegister
            ? "Join Herbal Communities and explore our offerings."
            : "Sign in to your account."}
        </p>

        <form className="space-y-3">
          {isRegister && (
            <input
              type="text"
              placeholder="Full Name"
              className="w-full border border-brand-200 rounded-md p-2"
            />
          )}
          <input
            type="email"
            placeholder="Email Address"
            className="w-full border border-brand-200 rounded-md p-2"
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-brand-200 rounded-md p-2"
          />
          <button className="w-full bg-leaf-500 text-white py-2 rounded-md hover:bg-leaf-600 transition">
            {isRegister ? "Sign Up" : "Login"}
          </button>
        </form>

        <p className="text-center text-sm text-brand-700 mt-4">
          {isRegister ? "Already have an account?" : "New here?"}{" "}
          <button
            onClick={() => setIsRegister(!isRegister)}
            className="text-leaf-600 hover:underline"
          >
            {isRegister ? "Login" : "Create one"}
          </button>
        </p>
      </div>
    </div>
  );
}
