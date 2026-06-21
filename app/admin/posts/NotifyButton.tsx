"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function NotifyButton({ postId, alreadySent }: { postId: number; alreadySent: boolean }) {
  const router = useRouter();
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  async function notify() {
    const verb = alreadySent ? "Resend" : "Send";
    if (!window.confirm(`${verb} the email notification for this post to all blog subscribers?`)) return;
    setSending(true);
    setError("");
    const res = await fetch(`/api/admin/posts/${postId}/notify`, { method: "POST" });
    setSending(false);
    if (res.ok) {
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to send");
    }
  }

  return (
    <div className="flex flex-col items-end gap-1 flex-shrink-0">
      <button
        onClick={notify}
        disabled={sending}
        className="text-xs uppercase tracking-[0.15em] px-3 py-1.5 transition-opacity disabled:opacity-40 whitespace-nowrap"
        style={{
          fontFamily: "var(--font-bebas)",
          border: "1px solid rgba(245,239,224,0.25)",
          color: "var(--color-cream)",
        }}
      >
        {sending ? "Sending…" : alreadySent ? "Resend Notification" : "Notify Subscribers"}
      </button>
      {error && (
        <span className="text-xs" style={{ color: "var(--color-coral)" }}>
          {error}
        </span>
      )}
    </div>
  );
}
