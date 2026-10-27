"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";
import { extractErrorMessage } from "@/lib/apiError";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: "Google sign-in failed. Please try again.",
  google_email_unverified: "Your Google email is not verified.",
  google_not_configured: "Google sign-in is not configured on this server.",
};

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const googleError = searchParams.get("error");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const displayError =
    error || (googleError ? GOOGLE_ERROR_MESSAGES[googleError] ?? "Google sign-in failed. Please try again." : "");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (res.ok) {
        router.push("/settings");
        router.refresh();
      } else {
        setError(await extractErrorMessage(res, "Login failed"));
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
        <div className="absolute top-20 right-20 w-72 h-72 bg-indigo-500/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl" />
      </div>

      <div className="w-full max-w-md relative z-10">
        <Link
          href="/"
          className="inline-flex items-center gap-2 mb-8 text-sm transition-colors hover:text-white"
          style={{ color: "var(--color-text-secondary)" }}
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          Back to home
        </Link>

        <div className="mb-8">
          <h1
            className="text-3xl md:text-4xl font-bold mb-2"
            style={{
              fontFamily: "var(--font-display)",
              color: "var(--color-text-primary)",
            }}
          >
            Welcome back
          </h1>
          <p style={{ color: "var(--color-text-secondary)" }}>
            Sign in to your account to continue
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-transparent outline-none transition-colors focus:border-indigo-500"
                style={{
                  border: "1px solid var(--color-border)",
                  color: "var(--color-text-primary)",
                }}
                placeholder="Enter your password"
              />
            </div>

            {displayError && (
              <p className="text-sm text-red-400">
                {displayError}
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
              {loading ? "Signing in…" : "Sign In"}
            </button>
          </form>

          <div className="mt-6 flex flex-col gap-2 text-center">
            <Link
              href="/reset-password"
              className="text-sm transition-colors hover:text-white"
              style={{ color: "var(--color-text-secondary)" }}
            >
              Forgot password?
            </Link>
            <div className="text-sm" style={{ color: "var(--color-text-secondary)" }}>
              Don't have an account?{" "}
              <Link href="/register" className="hover:text-white transition-colors" style={{ color: "var(--color-primary)" }}>
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

export default function LoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
