"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";

interface Settings {
  blog_subscribed: boolean;
  login_notifications: boolean;
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      onClick={onChange}
      className="mt-0.5 flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 relative"
      style={{ backgroundColor: checked ? "var(--color-coral)" : "rgba(245,239,224,0.15)" }}
    >
      <span
        className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
        style={{
          backgroundColor: "var(--color-cream)",
          left: checked ? "calc(100% - 1.25rem)" : "0.25rem",
        }}
      />
    </button>
  );
}

export default function SettingsForm() {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [signingOut, setSigningOut] = useState(false);

  const load = useCallback(async () => {
    const res = await fetch("/api/user/settings");
    if (res.ok) setSettings(await res.json());
  }, []);

  useEffect(() => { load(); }, [load]);

  async function save() {
    if (!settings) return;
    setSaving(true);
    setMessage("");
    const res = await fetch("/api/user/settings", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(settings),
    });
    setSaving(false);
    setMessage(res.ok ? "Saved." : "Failed to save.");
  }

  async function signOut() {
    setSigningOut(true);
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/");
  }

  function toggle(key: keyof Settings) {
    setSettings((s) => s ? { ...s, [key]: !s[key] } : s);
    setMessage("");
  }

  if (!settings) {
    return (
      <p className="text-sm" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
        Loading…
      </p>
    );
  }

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2
          className="uppercase leading-none mb-6"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.75rem" }}
        >
          Blog
        </h2>
        <label className="flex items-start gap-4 cursor-pointer">
          <Toggle checked={settings.blog_subscribed} onChange={() => toggle("blog_subscribed")} />
          <div>
            <p
              className="uppercase leading-none"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.1rem" }}
            >
              Blog Updates
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
              Get an email whenever a new post is published
            </p>
          </div>
        </label>
      </section>

      <section>
        <h2
          className="uppercase leading-none mb-6"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.75rem" }}
        >
          Notifications
        </h2>
        <label className="flex items-start gap-4 cursor-pointer">
          <Toggle checked={settings.login_notifications} onChange={() => toggle("login_notifications")} />
          <div>
            <p
              className="uppercase leading-none"
              style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.1rem" }}
            >
              Login Notifications
            </p>
            <p className="text-xs mt-0.5" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
              Receive an email when you sign in to your account
            </p>
          </div>
        </label>
      </section>

      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-4">
          <button
            onClick={save}
            disabled={saving}
            className="px-6 py-3 uppercase tracking-[0.2em] transition-opacity disabled:opacity-50"
            style={{
              fontFamily: "var(--font-bebas)",
              backgroundColor: "var(--color-coral)",
              color: "var(--color-cream)",
              fontSize: "1rem",
            }}
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
          {message && (
            <span className="text-sm" style={{ color: "var(--color-cream)", opacity: 0.7 }}>
              {message}
            </span>
          )}
        </div>

        <button
          onClick={signOut}
          disabled={signingOut}
          className="self-start px-6 py-3 uppercase tracking-[0.2em] transition-opacity disabled:opacity-50"
          style={{
            fontFamily: "var(--font-bebas)",
            border: "2px solid rgba(245,239,224,0.2)",
            color: "var(--color-cream)",
            fontSize: "1rem",
            opacity: 0.6,
          }}
        >
          {signingOut ? "Signing out…" : "Sign Out"}
        </button>
      </div>
    </div>
  );
}
