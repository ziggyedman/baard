"use client";

import { useState, FormEvent } from "react";
import Link from "next/link";

export default function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setLoading(true);
    await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    setSent(true);
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="w-full max-w-md">
        <Link
          href="/login"
          className="block mb-8 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          ← Back to sign in
        </Link>

        <h1
          className="uppercase leading-none mb-2"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 10vw, 5rem)",
          }}
        >
          Reset Password
        </h1>

        {sent ? (
          <div className="mt-6">
            <p className="text-base leading-relaxed" style={{ color: "var(--color-cream)", opacity: 0.8 }}>
              If an account exists for <strong>{email}</strong>, you'll receive a reset link shortly.
            </p>
            <Link
              href="/login"
              className="mt-8 block text-xs tracking-[0.2em] uppercase"
              style={{ color: "var(--color-cream)", opacity: 0.5, fontFamily: "var(--font-bebas)" }}
            >
              Return to sign in →
            </Link>
          </div>
        ) : (
          <>
            <p
              className="mb-10 text-sm tracking-[0.3em] uppercase"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
            >
              We'll send you a reset link
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div>
                <label
                  htmlFor="email"
                  className="block text-xs tracking-[0.2em] uppercase mb-2"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.7 }}
                >
                  Email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-4 py-3 bg-transparent text-sm outline-none"
                  style={{
                    border: "2px solid rgba(245,239,224,0.3)",
                    color: "var(--color-cream)",
                    fontFamily: "var(--font-inter)",
                  }}
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="mt-2 px-6 py-3 uppercase tracking-[0.2em] transition-opacity disabled:opacity-50"
                style={{
                  fontFamily: "var(--font-bebas)",
                  backgroundColor: "var(--color-coral)",
                  color: "var(--color-cream)",
                  fontSize: "1rem",
                }}
              >
                {loading ? "Sending…" : "Send Reset Link"}
              </button>
            </form>
          </>
        )}
      </div>
    </main>
  );
}
