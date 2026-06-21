import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { setBlogSubscription } from "@/lib/blogSubscription";

interface SettingsRow {
  blog_subscribed: number;
  login_notifications: number;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const row = db
    .prepare("SELECT blog_subscribed, login_notifications FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  if (!row) {
    return Response.json({ error: "Settings not found" }, { status: 404 });
  }

  return Response.json({
    blog_subscribed: !!row.blog_subscribed,
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
    .prepare("SELECT blog_subscribed, login_notifications FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  if (!current) {
    return Response.json({ error: "Settings not found" }, { status: 404 });
  }

  const blogSubscribed =
    typeof body.blog_subscribed === "boolean" ? body.blog_subscribed : !!current.blog_subscribed;
  const loginNotifications =
    typeof body.login_notifications === "boolean" ? body.login_notifications : !!current.login_notifications;

  if (blogSubscribed !== !!current.blog_subscribed) {
    try {
      await setBlogSubscription({ userId: session.userId, email: session.email, subscribed: blogSubscribed });
    } catch {
      return Response.json({ error: "Failed to update blog subscription" }, { status: 502 });
    }
  }

  db.prepare("UPDATE user_settings SET login_notifications = ? WHERE user_id = ?").run(
    loginNotifications ? 1 : 0,
    session.userId
  );

  return Response.json({ ok: true });
}
