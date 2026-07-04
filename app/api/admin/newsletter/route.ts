import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";

export interface NewsletterIssueRow {
  id: number;
  subject: string;
  content_html: string;
  created_at: number;
  broadcast_id: string | null;
  sent_at: number | null;
}

export async function GET() {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const issues = db
    .prepare("SELECT * FROM newsletter_issues ORDER BY created_at DESC")
    .all() as NewsletterIssueRow[];
  return Response.json({ issues });
}

export async function POST(request: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { subject, content_html } = await request.json();

  if (!subject || !content_html) {
    return Response.json({ error: "Subject and content are required" }, { status: 400 });
  }

  const result = db
    .prepare("INSERT INTO newsletter_issues (subject, content_html) VALUES (?, ?)")
    .run(subject, content_html);

  const issue = db
    .prepare("SELECT * FROM newsletter_issues WHERE id = ?")
    .get(result.lastInsertRowid) as NewsletterIssueRow;
  return Response.json({ issue });
}
