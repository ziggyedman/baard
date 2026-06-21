import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import type { PostRow } from "../route";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ post });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = db.prepare("SELECT id FROM posts WHERE id = ?").get(id);
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });

  const { title, excerpt, content_html } = await request.json();
  if (!title || !content_html) {
    return Response.json({ error: "Title and content are required" }, { status: 400 });
  }

  db.prepare("UPDATE posts SET title = ?, excerpt = ?, content_html = ? WHERE id = ?").run(
    title,
    excerpt ?? "",
    content_html,
    id
  );

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow;
  return Response.json({ post });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  db.prepare("DELETE FROM posts WHERE id = ?").run(id);
  return Response.json({ ok: true });
}
