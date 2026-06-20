"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/settings");
    } else {
      const data = await res.json();
      setError(data.error ?? "Registration failed");
    }
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
          Create Account
        </h1>
        <p
          className="mb-10 text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          Join to manage your preferences
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

          <div>
            <label
              htmlFor="password"
              className="block text-xs tracking-[0.2em] uppercase mb-2"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.7 }}
            >
              Password
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
            <p
              className="mt-1 text-xs"
              style={{ color: "var(--color-cream)", opacity: 0.4 }}
            >
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
            className="mt-2 px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity disabled:opacity-50"
            style={{
              fontFamily: "var(--font-bebas)",
              backgroundColor: "var(--color-coral)",
              color: "var(--color-cream)",
              fontSize: "1rem",
            }}
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>
        </form>
      </div>
    </main>
  );
}
