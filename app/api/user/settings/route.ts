import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { syncNewsletterSubscription } from "@/lib/email";

interface SettingsRow {
  newsletter_1: number;
  newsletter_2: number;
  newsletter_3: number;
  login_notifications: number;
  resend_contact_id_1: string | null;
  resend_contact_id_2: string | null;
  resend_contact_id_3: string | null;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = db
    .prepare("SELECT newsletter_1, newsletter_2, newsletter_3, login_notifications FROM user_settings WHERE user_id = ?")
    .get(session.userId) as Pick<SettingsRow, "newsletter_1" | "newsletter_2" | "newsletter_3" | "login_notifications"> | undefined;

  if (!row) {
    return Response.json({ error: "Settings not found" }, { status: 404 });
  }

  return Response.json({
    newsletter_1: !!row.newsletter_1,
    newsletter_2: !!row.newsletter_2,
    newsletter_3: !!row.newsletter_3,
    login_notifications: !!row.login_notifications,
  });
}

export async function PUT(request: NextRequest) {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const current = db
    .prepare("SELECT * FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  if (!current) {
    return Response.json({ error: "Settings not found" }, { status: 404 });
  }

  const n1 = typeof body.newsletter_1 === "boolean" ? body.newsletter_1 : !!current.newsletter_1;
  const n2 = typeof body.newsletter_2 === "boolean" ? body.newsletter_2 : !!current.newsletter_2;
  const n3 = typeof body.newsletter_3 === "boolean" ? body.newsletter_3 : !!current.newsletter_3;
  const loginNotifications =
    typeof body.login_notifications === "boolean" ? body.login_notifications : !!current.login_notifications;

  const [cid1, cid2, cid3] = await Promise.all([
    n1 !== !!current.newsletter_1 || (n1 && !current.resend_contact_id_1)
      ? syncNewsletterSubscription(session.email, 0, n1, current.resend_contact_id_1 ?? null)
      : current.resend_contact_id_1,
    n2 !== !!current.newsletter_2 || (n2 && !current.resend_contact_id_2)
      ? syncNewsletterSubscription(session.email, 1, n2, current.resend_contact_id_2 ?? null)
      : current.resend_contact_id_2,
    n3 !== !!current.newsletter_3 || (n3 && !current.resend_contact_id_3)
      ? syncNewsletterSubscription(session.email, 2, n3, current.resend_contact_id_3 ?? null)
      : current.resend_contact_id_3,
  ]);

  db.prepare(`
    UPDATE user_settings SET
      newsletter_1 = ?,
      newsletter_2 = ?,
      newsletter_3 = ?,
      login_notifications = ?,
      resend_contact_id_1 = ?,
      resend_contact_id_2 = ?,
      resend_contact_id_3 = ?
    WHERE user_id = ?
  `).run(
    n1 ? 1 : 0,
    n2 ? 1 : 0,
    n3 ? 1 : 0,
    loginNotifications ? 1 : 0,
    cid1 ?? null,
    cid2 ?? null,
    cid3 ?? null,
    session.userId
  );

  return Response.json({ ok: true });
}
