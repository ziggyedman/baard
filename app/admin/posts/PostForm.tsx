"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

const PostEditor = dynamic(() => import("./Editor"), { ssr: false });

interface Props {
  postId?: number;
  initialTitle?: string;
  initialExcerpt?: string;
  initialContentHtml?: string;
  initialSlug?: string;
}

export default function PostForm({
  postId,
  initialTitle = "",
  initialExcerpt = "",
  initialContentHtml = "",
  initialSlug,
}: Props) {
  const router = useRouter();
  const [title, setTitle] = useState(initialTitle);
  const [excerpt, setExcerpt] = useState(initialExcerpt);
  const [contentHtml, setContentHtml] = useState(initialContentHtml);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  const isEdit = postId !== undefined;

  async function handleSubmit() {
    setError("");
    if (!title.trim() || !contentHtml.trim()) {
      setError("Title and content are required");
      return;
    }
    setSaving(true);
    const res = await fetch(isEdit ? `/api/admin/posts/${postId}` : "/api/admin/posts", {
      method: isEdit ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ title, excerpt, content_html: contentHtml }),
    });
    setSaving(false);
    if (res.ok) {
      router.push("/admin/posts");
      router.refresh();
    } else {
      const data = await res.json();
      setError(data.error ?? "Failed to save post");
    }
  }

  async function handleDelete() {
    if (!postId) return;
    if (!window.confirm("Delete this post? This cannot be undone.")) return;
    await fetch(`/api/admin/posts/${postId}`, { method: "DELETE" });
    router.push("/admin/posts");
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
      {isEdit && initialSlug && (
        <p className="text-xs" style={{ color: "var(--color-cream)", opacity: 0.4 }}>
          /blog/{initialSlug}
        </p>
      )}

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={labelStyle}>
          Title
        </label>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full px-4 py-3 text-sm outline-none"
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={labelStyle}>
          Excerpt
        </label>
        <textarea
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          rows={2}
          className="w-full px-4 py-3 text-sm outline-none resize-none"
          style={inputStyle}
        />
      </div>

      <div>
        <label className="block text-xs tracking-[0.2em] uppercase mb-2" style={labelStyle}>
          Content
        </label>
        <PostEditor contentHtml={contentHtml} onChange={setContentHtml} />
      </div>

      {error && (
        <p className="text-sm" style={{ color: "var(--color-coral)" }}>
          {error}
        </p>
      )}

      <div className="flex items-center gap-4">
        <button
          onClick={handleSubmit}
          disabled={saving}
          className="px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity disabled:opacity-50"
          style={{
            fontFamily: "var(--font-bebas)",
            backgroundColor: "var(--color-coral)",
            color: "var(--color-cream)",
          }}
        >
          {saving ? "Saving…" : isEdit ? "Save Changes" : "Create Post"}
        </button>
        {isEdit && (
          <button
            onClick={handleDelete}
            className="px-6 py-3 uppercase tracking-[0.2em] text-sm transition-opacity"
            style={{
              fontFamily: "var(--font-bebas)",
              border: "2px solid rgba(245,239,224,0.2)",
              color: "var(--color-cream)",
              opacity: 0.6,
            }}
          >
            Delete
          </button>
        )}
      </div>
    </div>
  );
}
