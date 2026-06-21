import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { uniqueSlugFromTitle } from "@/lib/posts";

export interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
  published_at: number;
  broadcast_id: string | null;
  broadcast_sent_at: number | null;
}

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const posts = db.prepare("SELECT * FROM posts ORDER BY published_at DESC").all() as PostRow[];
  return Response.json({ posts });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { title, excerpt, content_html } = await request.json();

  if (!title || !content_html) {
    return Response.json({ error: "Title and content are required" }, { status: 400 });
  }

  const slug = uniqueSlugFromTitle(title);
  const result = db
    .prepare("INSERT INTO posts (slug, title, excerpt, content_html) VALUES (?, ?, ?, ?)")
    .run(slug, title, excerpt ?? "", content_html);

  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(result.lastInsertRowid) as PostRow;
  return Response.json({ post });
}
