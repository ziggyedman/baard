"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { extractErrorMessage } from "@/lib/apiError";

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
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/settings");
      } else {
        setError(await extractErrorMessage(res, "Registration failed"));
      }
    } catch {
      setError("Could not reach the server. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen flex items-center justify-center px-4 py-20 relative overflow-hidden">
      {/* Background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-[#0a0a0f] via-[#111118] to-[#0a0a0f]" />
        <div className="absolute top-20 left-20 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-20 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/login"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-white"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to sign in
        </Link>

        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Create account
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Join to manage your preferences
          </p>
        </div>

        <div className="win p-8">
          <a
            href="/api/auth/google"
            className="flex items-center justify-center gap-3 w-full px-6 py-3 bg-white text-gray-900 rounded-xl font-medium transition-all hover:shadow-lg hover:shadow-white/10 mb-6"
          >
            <FcGoogle size={20} />
            Continue with Google
          </a>

          <div className="flex items-center gap-3 mb-6">
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
            <span className="text-xs" style={{ color: "var(--color-text-muted)" }}>
              or
            </span>
            <div className="flex-1 h-px" style={{ backgroundColor: "var(--color-border)" }} />
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-primary)" }}
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
                className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-colors focus:border-indigo-500"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="you@example.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium mb-2"
                style={{ color: "var(--color-text-primary)" }}
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
                className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-colors focus:border-indigo-500"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="Minimum 8 characters"
              />
              <p className="mt-1 text-xs" style={{ color: "var(--color-text-muted)" }}>
                Must be at least 8 characters
              </p>
            </div>

            {error && (
              <p className="text-sm text-red-400">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full px-6 py-3 rounded-md text-sm font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              style={{
                background: "#4ade80",
                color: "#0a0e14",
              }}
            >
              {loading ? "Creating account…" : "Create Account"}
            </button>
          </form>

          <div className="mt-6 text-center text-sm" style={{ color: "var(--color-text-secondary)" }}>
            Already have an account?{" "}
            <Link href="/login" className="hover:text-white transition-colors" style={{ color: "var(--color-primary)" }}>
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </main>
  );
}
