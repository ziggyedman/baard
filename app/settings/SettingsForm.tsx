"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { NEWSLETTERS } from "@/lib/email";

interface Settings {
  newsletter_1: boolean;
  newsletter_2: boolean;
  newsletter_3: boolean;
  login_notifications: boolean;
}

interface Props {
  newsletters: typeof NEWSLETTERS;
}

export default function SettingsForm({ newsletters }: Props) {
  const router = useRouter();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState("");
  const [signingOut, setSigningOut] = useState(false);
  const [sending, setSending] = useState<number | null>(null);
  const [sendMessage, setSendMessage] = useState<{ index: number; text: string } | null>(null);

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

  async function sendMeCopy(index: number) {
    setSending(index);
    setSendMessage(null);
    const res = await fetch("/api/newsletter/send-me", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ newsletterIndex: index }),
    });
    setSending(null);
    const data = await res.json();
    setSendMessage({
      index,
      text: res.ok ? "Sent! Check your inbox." : (data.error ?? "Failed to send."),
    });
  }

  if (!settings) {
    return (
      <p className="text-sm" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
        Loading…
      </p>
    );
  }

  const newsletterKeys: (keyof Settings)[] = ["newsletter_1", "newsletter_2", "newsletter_3"];

  return (
    <div className="flex flex-col gap-12">
      <section>
        <h2
          className="uppercase leading-none mb-6"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.75rem" }}
        >
          Newsletters
        </h2>
        <div className="flex flex-col gap-6">
          {newsletters.map((nl, i) => {
            const key = newsletterKeys[i];
            const subscribed = settings[key];
            return (
              <div key={nl.id} className="flex flex-col gap-2">
                <label className="flex items-start gap-4 cursor-pointer">
                  <button
                    type="button"
                    role="switch"
                    aria-checked={subscribed}
                    onClick={() => toggle(key)}
                    className="mt-0.5 flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 relative"
                    style={{
                      backgroundColor: subscribed ? "var(--color-coral)" : "rgba(245,239,224,0.15)",
                    }}
                  >
                    <span
                      className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
                      style={{
                        backgroundColor: "var(--color-cream)",
                        left: subscribed ? "calc(100% - 1.25rem)" : "0.25rem",
                      }}
                    />
                  </button>
                  <div>
                    <p
                      className="uppercase leading-none"
                      style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.1rem" }}
                    >
                      {nl.name}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
                      {subscribed ? "Subscribed" : "Unsubscribed"}
                    </p>
                  </div>
                </label>

                {subscribed && (
                  <div className="ml-14 flex items-center gap-3">
                    <button
                      onClick={() => sendMeCopy(i)}
                      disabled={sending === i}
                      className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 transition-opacity disabled:opacity-40"
                      style={{
                        fontFamily: "var(--font-bebas)",
                        border: "1px solid rgba(245,239,224,0.25)",
                        color: "var(--color-cream)",
                        opacity: 0.7,
                        fontSize: "0.75rem",
                      }}
                    >
                      {sending === i ? "Sending…" : "Send me a copy"}
                    </button>
                    {sendMessage?.index === i && (
                      <span className="text-xs" style={{ color: "var(--color-cream)", opacity: 0.6 }}>
                        {sendMessage.text}
                      </span>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      <section>
        <h2
          className="uppercase leading-none mb-6"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.75rem" }}
        >
          Notifications
        </h2>
        <label className="flex items-start gap-4 cursor-pointer">
          <button
            type="button"
            role="switch"
            aria-checked={settings.login_notifications}
            onClick={() => toggle("login_notifications")}
            className="mt-0.5 flex-shrink-0 w-10 h-6 rounded-full transition-colors duration-200 relative"
            style={{
              backgroundColor: settings.login_notifications ? "var(--color-coral)" : "rgba(245,239,224,0.15)",
            }}
          >
            <span
              className="absolute top-1 w-4 h-4 rounded-full transition-transform duration-200"
              style={{
                backgroundColor: "var(--color-cream)",
                left: settings.login_notifications ? "calc(100% - 1.25rem)" : "0.25rem",
              }}
            />
          </button>
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
