import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendNewsletterToUser, NEWSLETTERS } from "@/lib/email";

interface SettingsRow {
  newsletter_1: number;
  newsletter_2: number;
  newsletter_3: number;
}

export async function POST(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { newsletterIndex } = await request.json();
  if (newsletterIndex !== 0 && newsletterIndex !== 1 && newsletterIndex !== 2) {
    return Response.json({ error: "Invalid newsletter" }, { status: 400 });
  }

  const settings = db
    .prepare("SELECT newsletter_1, newsletter_2, newsletter_3 FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  const keys: (keyof SettingsRow)[] = ["newsletter_1", "newsletter_2", "newsletter_3"];
  if (!settings?.[keys[newsletterIndex]]) {
    return Response.json({ error: "Not subscribed to this newsletter" }, { status: 403 });
  }

  const envKey = `RESEND_NEWSLETTER_TEMPLATE_ID_${NEWSLETTERS[newsletterIndex].id}`;
  if (!process.env[envKey]) {
    return Response.json({ error: "Newsletter template not configured" }, { status: 503 });
  }

  await sendNewsletterToUser(session.email, newsletterIndex as 0 | 1 | 2);
  return Response.json({ ok: true });
}
