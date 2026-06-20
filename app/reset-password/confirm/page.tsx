"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";

function ConfirmForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/reset-password/confirm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ token, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/login?reset=1");
    } else {
      const data = await res.json();
      setError(data.error ?? "Reset failed");
    }
  }

  if (!token) {
    return (
      <p style={{ color: "var(--color-coral)" }}>
        Invalid reset link. Please request a new one.
      </p>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div>
        <label
          htmlFor="password"
          className="block text-xs tracking-[0.2em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.7 }}
        >
          New Password
        </label>
        <input
          id="password"
          type="password"
          required
          minLength={8}
          autoComplete="new-password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-3 bg-transparent text-sm outline-none"
          style={{
            border: "2px solid rgba(245,239,224,0.3)",
            color: "var(--color-cream)",
            fontFamily: "var(--font-inter)",
          }}
        />
        <p className="mt-1 text-xs" style={{ color: "var(--color-cream)", opacity: 0.4 }}>
          Minimum 8 characters
        </p>
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--color-coral)" }}>
          {error}
        </p>
      )}

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
        {loading ? "Saving…" : "Set New Password"}
      </button>
    </form>
  );
}

export default function ConfirmResetPage() {
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
          className="uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 10vw, 5rem)",
          }}
        >
          New Password
        </h1>

        <Suspense fallback={<p style={{ color: "var(--color-cream)", opacity: 0.5 }}>Loading…</p>}>
          <ConfirmForm />
        </Suspense>
      </div>
    </main>
  );
}
