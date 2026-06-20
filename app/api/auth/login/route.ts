import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";
import { sendLoginNotificationEmail } from "@/lib/email";

interface UserRow {
  id: number;
  email: string;
  password_hash: string;
}

interface SettingsRow {
  login_notifications: number;
}

export async function POST(request: NextRequest) {
  const { email, password } = await request.json();

  if (!email || !password) {
    return Response.json({ error: "Email and password are required" }, { status: 400 });
  }

  const user = db.prepare("SELECT id, email, password_hash FROM users WHERE email = ?").get(
    email.toLowerCase()
  ) as UserRow | undefined;

  const valid = user ? await bcrypt.compare(password, user.password_hash) : false;

  if (!user || !valid) {
    return Response.json({ error: "Invalid email or password" }, { status: 401 });
  }

  const token = await signToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  const settings = db
    .prepare("SELECT login_notifications FROM user_settings WHERE user_id = ?")
    .get(user.id) as SettingsRow | undefined;

  if (settings?.login_notifications) {
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
      request.headers.get("x-real-ip") ??
      "Unknown";
    const userAgent = request.headers.get("user-agent") ?? "Unknown";
    sendLoginNotificationEmail(user.email, {
      ip,
      userAgent,
      baseUrl: request.nextUrl.origin,
    }).catch(() => {});
  }

  return Response.json({ ok: true });
}
