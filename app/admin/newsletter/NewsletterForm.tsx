"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const NewsletterEditor = dynamic(() => import("../posts/Editor"), { ssr: false });

interface Props {
  issueId?: number;
  initialSubject?: string;
  initialContentHtml?: string;
  sent?: boolean;
}

export default function NewsletterForm({
  issueId,
  initialSubject = "",
  initialContentHtml = "",
  sent = false,
}: Props) {
  const router = useRouter();
  const [subject, setSubject] = useState(initialSubject);
  const [contentHtml, setContentHtml] = useState(initialContentHtml);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);

  const isEdit = issueId !== undefined;

  async function handleSubmit() {
    setError("");
    if (!subject.trim() || !contentHtml.trim()) {
      setError("Subject and content are required");
      return;
    }
    setSaving(true);
    const res = await fetch(isEdit ? `/api/admin/newsletter/${issueId}` : "/api/admin/newsletter", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subject, content_html: contentHtml }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/newsletter");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save issue");
    }
  }

  async function handleSend() {
    if (!issueId) return;
    if (!window.confirm("Send this newsletter issue to all subscribers now? This cannot be undone.")) return;
    setSending(true);
    setError("");
    const res = await fetch(`/api/admin/newsletter/${issueId}/send`, { method: "POST" });
    setSending(false);
    if (res.ok) {
      router.push("/admin/newsletter");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to send");
    }
  }

  async function handleDelete() {
    if (!issueId) return;
    if (!window.confirm("Delete this draft? This cannot be undone.")) return;
    await fetch(`/api/admin/newsletter/${issueId}`, { method: "DELETE" });
    router.push("/admin/newsletter");
    router.refresh();
  }

  const labelStyle = {
    fontFamily: "var(--font-bebas)",
    color: "var(--color-cream)",
    opacity: 0.7,
  };
  const inputStyle = {
    border: "2px solid rgba(245,239,224,0.3)",
    color: "var(--color-cream)",
    fontFamily: "var(--font-inter)",
    backgroundColor: "transparent",
  };

  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={labelStyle}>
          Subject
        </label>
        <input
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={sent}
          className="w-full px-4 py-3 text-sm outline-none disabled:opacity-50"
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={labelStyle}>
          Content
        </label>
        {sent ? (
          <div
            className="prose-blog-editor px-4 py-3"
            style={{ border: "2px solid rgba(245,239,224,0.15)", color: "var(--color-cream)", opacity: 0.6 }}
            dangerouslySetInnerHTML={{ __html: contentHtml }}
          />
        ) : (
          <NewsletterEditor contentHtml={contentHtml} onChange={setContentHtml} />
        )}
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--color-coral)" }}>
          {error}
        </p>
      )}

      {sent ? (
        <p className="text-sm" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
          This issue has already been sent and can no longer be edited.
        </p>
      ) : (
        <div className="flex items-center gap-4">
          <button
            onClick={handleSubmit}
            disabled={saving || sending}
            className="px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity disabled:opacity-50"
            style={{
              fontFamily: "var(--font-bebas)",
              backgroundColor: "var(--color-coral)",
              color: "var(--color-cream)",
            }}
          >
            {saving ? "Saving…" : isEdit ? "Save Changes" : "Save Draft"}
          </button>
          {isEdit && (
            <>
              <button
                onClick={handleSend}
                disabled={saving || sending}
                className="px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity disabled:opacity-50"
                style={{
                  fontFamily: "var(--font-bebas)",
                  backgroundColor: "var(--color-gold)",
                  color: "var(--color-navy)",
                }}
              >
                {sending ? "Sending…" : "Send to Subscribers"}
              </button>
              <button
                onClick={handleDelete}
                disabled={saving || sending}
                className="px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity disabled:opacity-50"
                style={{
                  fontFamily: "var(--font-bebas)",
                  border: "2px solid rgba(245,239,224,0.2)",
                  color: "var(--color-cream)",
                  opacity: 0.6,
                }}
              >
                Delete
              </button>
            </>
          )}
        </div>
      )}
    </div>
  );
}
