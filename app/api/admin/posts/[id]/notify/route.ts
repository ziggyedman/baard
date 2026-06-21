import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { sendBlogBroadcast } from "@/lib/email";
import type { PostRow } from "../../route";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const post = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow | undefined;
  if (!post) return Response.json({ error: "Not found" }, { status: 404 });

  let broadcastId: string;
  try {
    broadcastId = await sendBlogBroadcast(post, request.nextUrl.origin);
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to send broadcast";
    return Response.json({ error: message }, { status: 502 });
  }

  db.prepare("UPDATE posts SET broadcast_id = ?, broadcast_sent_at = unixepoch() WHERE id = ?").run(
    broadcastId,
    id
  );

  const updated = db.prepare("SELECT * FROM posts WHERE id = ?").get(id) as PostRow;
  return Response.json({ post: updated });
}
