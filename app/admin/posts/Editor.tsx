"use client";

import { useEditor, EditorContent, type Editor as TiptapEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import ImageExtension from "@tiptap/extension-image";
import LinkExtension from "@tiptap/extension-link";
import { TextStyle } from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import { useEffect, useRef } from "react";

const PALETTE = [
  { name: "Cream", value: "#F5EFE0" },
  { name: "Gold", value: "#EEC066" },
  { name: "Coral", value: "#ED5152" },
  { name: "Navy", value: "#2A4563" },
  { name: "Blue Electric", value: "#2863A7" },
];

const TEMPLATES: { label: string; html: string }[] = [
  {
    label: "Intro + Image + Body",
    html: "<p>Start with a short hook that pulls the reader in.</p><p></p><p></p><p>Continue the story here.</p>",
  },
  {
    label: "Quote callout",
    html: "<blockquote><p>A memorable quote goes here.</p></blockquote><p></p>",
  },
];

interface Props {
  contentHtml: string;
  onChange: (html: string) => void;
}

function ToolbarButton({
  active,
  onClick,
  children,
  title,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
  title: string;
}) {
  return (
    <button
      type="button"
      title={title}
      onClick={onClick}
      className="px-2.5 py-1.5 text-xs uppercase tracking-[0.1em] transition-opacity"
      style={{
        fontFamily: "var(--font-bebas)",
        border: "1px solid rgba(245,239,224,0.25)",
        color: "var(--color-cream)",
        backgroundColor: active ? "rgba(237,81,82,0.3)" : "transparent",
      }}
    >
      {children}
    </button>
  );
}

function Toolbar({ editor }: { editor: TiptapEditor }) {
  const fileInputRef = useRef<HTMLInputElement>(null);

  async function uploadImage(file: File) {
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/admin/uploads", { method: "POST", body: formData });
    if (!res.ok) {
      alert("Image upload failed");
      return;
    }
    const { url } = await res.json();
    editor.chain().focus().setImage({ src: url }).run();
  }

  function addLink() {
    const previousUrl = editor.getAttributes("link").href as string | undefined;
    const url = window.prompt("Link URL", previousUrl ?? "https://");
    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }

  return (
    <div
      className="flex flex-wrap items-center gap-2 p-2 mb-2"
      style={{ border: "2px solid rgba(245,239,224,0.3)", borderBottom: "none" }}
    >
      <ToolbarButton title="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}>
        B
      </ToolbarButton>
      <ToolbarButton title="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}>
        I
      </ToolbarButton>
      <ToolbarButton title="Heading 2" active={editor.isActive("heading", { level: 2 })} onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}>
        H2
      </ToolbarButton>
      <ToolbarButton title="Heading 3" active={editor.isActive("heading", { level: 3 })} onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}>
        H3
      </ToolbarButton>
      <ToolbarButton title="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}>
        List
      </ToolbarButton>
      <ToolbarButton title="Ordered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}>
        1.List
      </ToolbarButton>
      <ToolbarButton title="Blockquote" active={editor.isActive("blockquote")} onClick={() => editor.chain().focus().toggleBlockquote().run()}>
        Quote
      </ToolbarButton>
      <ToolbarButton title="Link" active={editor.isActive("link")} onClick={addLink}>
        Link
      </ToolbarButton>
      <ToolbarButton title="Image" onClick={() => fileInputRef.current?.click()}>
        Image
      </ToolbarButton>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg,image/gif,image/webp"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) uploadImage(file);
          e.target.value = "";
        }}
      />

      <div className="flex items-center gap-1 ml-1">
        {PALETTE.map((color) => (
          <button
            key={color.value}
            type="button"
            title={color.name}
            onClick={() => editor.chain().focus().setColor(color.value).run()}
            className="w-5 h-5 rounded-full"
            style={{ backgroundColor: color.value, border: "1px solid rgba(245,239,224,0.4)" }}
          />
        ))}
        <ToolbarButton title="Clear color" onClick={() => editor.chain().focus().unsetColor().run()}>
          ×
        </ToolbarButton>
      </div>

      <select
        title="Insert template"
        defaultValue=""
        onChange={(e) => {
          const template = TEMPLATES.find((t) => t.label === e.target.value);
          if (template) editor.chain().focus().insertContent(template.html).run();
          e.target.value = "";
        }}
        className="text-xs uppercase tracking-[0.1em] px-2 py-1.5 bg-transparent ml-1"
        style={{
          fontFamily: "var(--font-bebas)",
          border: "1px solid rgba(245,239,224,0.25)",
          color: "var(--color-cream)",
        }}
      >
        <option value="" disabled>
          Insert template
        </option>
        {TEMPLATES.map((t) => (
          <option key={t.label} value={t.label} style={{ color: "black" }}>
            {t.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default function PostEditor({ contentHtml, onChange }: Props) {
  const editor = useEditor({
    immediatelyRender: false,
    extensions: [
      StarterKit,
      ImageExtension,
      LinkExtension.configure({ openOnClick: false }),
      TextStyle,
      Color,
    ],
    content: contentHtml,
    onUpdate: ({ editor }) => onChange(editor.getHTML()),
    editorProps: {
      attributes: {
        class: "prose-blog-editor min-h-[300px] px-4 py-3 outline-none",
      },
    },
  });

  useEffect(() => {
    return () => editor?.destroy();
  }, [editor]);

  if (!editor) return null;

  return (
    <div>
      <Toolbar editor={editor} />
      <div style={{ border: "2px solid rgba(245,239,224,0.3)" }}>
        <EditorContent editor={editor} style={{ color: "var(--color-cream)" }} />
      </div>
    </div>
  );
}
