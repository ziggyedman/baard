"use client";

import { useState, FormEvent, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import { FcGoogle } from "react-icons/fc";

const GOOGLE_ERROR_MESSAGES: Record<string, string> = {
  google_auth_failed: "Google sign-in failed. Please try again.",
  google_email_unverified: "Your Google email is not verified.",
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
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });
    setLoading(false);
    if (res.ok) {
      router.push("/settings");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Login failed");
    }
  }

  return (
    <main
      className="min-h-screen flex items-center justify-center px-4 grain"
      style={{ backgroundColor: "var(--color-blue-electric)" }}
    >
      <div className="w-full max-w-md">
        <Link
          href="/"
          className="block mb-8 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          ← Back
        </Link>

        <h1
          className="uppercase leading-none mb-2"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 10vw, 5rem)",
          }}
        >
          Sign In
        </h1>
        <p
          className="mb-10 text-sm tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          Access your account
        </p>

        <a
          href="/api/auth/google"
          className="flex items-center justify-center gap-3 px-6 py-3 text-sm transition-opacity hover:opacity-90"
          style={{
            backgroundColor: "var(--color-cream)",
            color: "var(--color-navy)",
            fontFamily: "var(--font-inter)",
          }}
        >
          <FcGoogle size={20} />
          Continue with Google
        </a>

        <div className="flex items-center gap-3 my-6">
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,239,224,0.2)" }} />
          <span
            className="text-xs tracking-[0.2em] uppercase"
            style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.4 }}
          >
            Or
          </span>
          <div className="flex-1 h-px" style={{ backgroundColor: "rgba(245,239,224,0.2)" }} />
        </div>

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
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 bg-transparent text-sm outline-none"
              style={{
                border: "2px solid rgba(245,239,224,0.3)",
                color: "var(--color-cream)",
                fontFamily: "var(--font-inter)",
              }}
            />
          </div>

          {displayError && (
            <p className="text-sm" style={{ color: "var(--color-coral)" }}>
              {displayError}
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
            {loading ? "Signing in…" : "Sign In"}
          </button>
        </form>

        <div className="mt-8 flex flex-col gap-3">
          <Link
            href="/reset-password"
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-cream)", opacity: 0.5, fontFamily: "var(--font-bebas)" }}
          >
            Forgot password?
          </Link>
          <Link
            href="/register"
            className="text-xs tracking-[0.15em] uppercase"
            style={{ color: "var(--color-cream)", opacity: 0.5, fontFamily: "var(--font-bebas)" }}
          >
            No account yet? Create one →
          </Link>
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
