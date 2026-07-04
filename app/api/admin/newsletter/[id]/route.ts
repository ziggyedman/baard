import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import type { NewsletterIssueRow } from "../route";

interface Params {
  params: Promise<{ id: string }>;
}

export async function GET(_request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const issue = db.prepare("SELECT * FROM newsletter_issues WHERE id = ?").get(id) as
    | NewsletterIssueRow
    | undefined;
  if (!issue) return Response.json({ error: "Not found" }, { status: 404 });

  return Response.json({ issue });
}

export async function PUT(request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const existing = db.prepare("SELECT id, sent_at FROM newsletter_issues WHERE id = ?").get(id) as
    | { id: number; sent_at: number | null }
    | undefined;
  if (!existing) return Response.json({ error: "Not found" }, { status: 404 });
  if (existing.sent_at) {
    return Response.json({ error: "Cannot edit an issue that's already been sent" }, { status: 409 });
  }

  const { subject, content_html } = await request.json();
  if (!subject || !content_html) {
    return Response.json({ error: "Subject and content are required" }, { status: 400 });
  }

  db.prepare("UPDATE newsletter_issues SET subject = ?, content_html = ? WHERE id = ?").run(
    subject,
    content_html,
    id
  );

  const issue = db.prepare("SELECT * FROM newsletter_issues WHERE id = ?").get(id) as NewsletterIssueRow;
  return Response.json({ issue });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  db.prepare("DELETE FROM newsletter_issues WHERE id = ?").run(id);
  return Response.json({ ok: true });
}
