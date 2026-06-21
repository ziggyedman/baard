import { NextRequest } from "next/server";
import db from "@/lib/db";
import { getSession } from "@/lib/auth";
import { getBlogSubscriptionStatus } from "@/lib/email";

interface SettingsRow {
  blog_subscribed: number;
}

export async function GET(request: NextRequest) {
  const session = await getSession();

  if (session) {
    const row = db
      .prepare("SELECT blog_subscribed FROM user_settings WHERE user_id = ?")
      .get(session.userId) as SettingsRow | undefined;
    return Response.json({
      subscribed: !!row?.blog_subscribed,
      email: session.email,
      loggedIn: true,
    });
  }

  const cookieEmail = request.cookies.get("blog_sub_email")?.value ?? null;
  if (!cookieEmail) {
    return Response.json({ subscribed: false, email: null, loggedIn: false });
  }

  const subscribed = await getBlogSubscriptionStatus(cookieEmail).catch(() => false);
  return Response.json({ subscribed, email: cookieEmail, loggedIn: false });
}
