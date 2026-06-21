"use client";

import { useState, useEffect, FormEvent } from "react";

export default function BlogSubscribeWidget() {
  const [loaded, setLoaded] = useState(false);
  const [subscribed, setSubscribed] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState("");
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetch("/api/blog/subscription")
      .then((r) => r.json())
      .then((data) => {
        setSubscribed(data.subscribed);
        setLoggedIn(data.loggedIn);
        if (data.email) setEmail(data.email);
        setLoaded(true);
      })
      .catch(() => setLoaded(true));
  }, []);

  async function subscribe(e: FormEvent) {
    e.preventDefault();
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/blog/subscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    if (res.ok) {
      setSubscribed(true);
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to subscribe");
    }
  }

  async function unsubscribe() {
    setBusy(true);
    setMessage("");
    const res = await fetch("/api/blog/unsubscribe", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setBusy(false);
    if (res.ok) {
      setSubscribed(false);
    } else {
      const data = await res.json();
      setMessage(data.error ?? "Failed to unsubscribe");
    }
  }

  if (!loaded) return null;

  return (
    <div
      className="px-6 py-8 flex flex-col gap-4"
      style={{ border: "2px solid rgba(245,239,224,0.2)" }}
    >
      <div>
        <p
          className="uppercase leading-none mb-1"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-gold)", fontSize: "1.5rem" }}
        >
          Blog Updates
        </p>
        <p className="text-sm" style={{ color: "var(--color-cream)", opacity: 0.6 }}>
          {subscribed
            ? "You're subscribed — we'll email you when a new post goes up."
            : "Get an email whenever a new post is published."}
        </p>
      </div>

      {subscribed ? (
        <button
          onClick={unsubscribe}
          disabled={busy}
          className="self-start px-5 py-2.5 uppercase tracking-[0.15em] text-sm transition-opacity disabled:opacity-50"
          style={{
            fontFamily: "var(--font-bebas)",
            border: "2px solid rgba(245,239,224,0.25)",
            color: "var(--color-cream)",
          }}
        >
          {busy ? "Unsubscribing…" : "Unsubscribe"}
        </button>
      ) : (
        <form onSubmit={subscribe} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            required
            placeholder="you@example.com"
            value={email}
            disabled={loggedIn}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-2.5 bg-transparent text-sm outline-none disabled:opacity-60"
            style={{
              border: "2px solid rgba(245,239,224,0.3)",
              color: "var(--color-cream)",
              fontFamily: "var(--font-inter)",
            }}
          />
          <button
            type="submit"
            disabled={busy}
            className="px-5 py-2.5 uppercase tracking-[0.15em] text-sm transition-opacity disabled:opacity-50"
            style={{
              fontFamily: "var(--font-bebas)",
              backgroundColor: "var(--color-coral)",
              color: "var(--color-cream)",
            }}
          >
            {busy ? "Subscribing…" : "Subscribe"}
          </button>
        </form>
      )}

      {message && (
        <p className="text-sm" style={{ color: "var(--color-coral)" }}>
          {message}
        </p>
      )}
    </div>
  );
}
