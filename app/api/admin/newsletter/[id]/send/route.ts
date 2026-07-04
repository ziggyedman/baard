import { NextRequest } from "next/server";
import db from "@/lib/db";
import { requireAdminSession } from "@/lib/auth";
import { sendNewsletterBroadcast } from "@/lib/email";
import type { NewsletterIssueRow } from "../../route";

interface Params {
  params: Promise<{ id: string }>;
}

export async function POST(_request: NextRequest, { params }: Params) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const issue = db.prepare("SELECT * FROM newsletter_issues WHERE id = ?").get(id) as
    | NewsletterIssueRow
    | undefined;
  if (!issue) return Response.json({ error: "Not found" }, { status: 404 });
  if (issue.sent_at) return Response.json({ error: "This issue was already sent" }, { status: 409 });

  let broadcastId: string;
  try {
    broadcastId = await sendNewsletterBroadcast(issue.subject, issue.content_html);
  } catch (err) {
    console.error("[newsletter-send] failed", err);
    const message = err instanceof Error ? err.message : "Failed to send newsletter";
    return Response.json({ error: message }, { status: 502 });
  }

  db.prepare("UPDATE newsletter_issues SET broadcast_id = ?, sent_at = unixepoch() WHERE id = ?").run(
    broadcastId,
    id
  );

  const updated = db.prepare("SELECT * FROM newsletter_issues WHERE id = ?").get(id) as NewsletterIssueRow;
  return Response.json({ issue: updated });
}
