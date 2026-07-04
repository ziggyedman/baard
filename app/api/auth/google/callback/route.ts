import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";
import { sendLoginNotificationEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/url";

interface UserRow {
  id: number;
  email: string;
  google_id: string | null;
}

interface SettingsRow {
  login_notifications: number;
}

interface GoogleTokenResponse {
  access_token: string;
}

interface GoogleUserInfo {
  sub: string;
  email?: string;
  email_verified?: boolean;
}

function redirectWithError(origin: string, error: string) {
  const url = new URL("/login", origin);
  url.searchParams.set("error", error);
  return NextResponse.redirect(url);
}

export async function GET(request: NextRequest) {
  const origin = getAppUrl(request);
  try {
    return await handleCallback(request, origin);
  } catch (err) {
    console.error("[google-oauth] unexpected error", err);
    return redirectWithError(origin, "google_auth_failed");
  }
}

async function handleCallback(request: NextRequest, origin: string) {
  const code = request.nextUrl.searchParams.get("code");
  const state = request.nextUrl.searchParams.get("state");
  const cookieState = request.cookies.get("google_oauth_state")?.value;

  if (!code || !state || !cookieState || state !== cookieState) {
    console.error("[google-oauth] callback missing/mismatched state", {
      hasCode: !!code,
      hasState: !!state,
      hasCookieState: !!cookieState,
    });
    return redirectWithError(origin, "google_auth_failed");
  }

  const clientId = process.env.GOOGLE_CLIENT_ID;
  const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
  if (!clientId || !clientSecret) {
    console.error("[google-oauth] GOOGLE_CLIENT_ID or GOOGLE_CLIENT_SECRET is not set");
    return redirectWithError(origin, "google_auth_failed");
  }

  const tokenRes = await fetch("https://oauth2.googleapis.com/token", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: `${origin}/api/auth/google/callback`,
      grant_type: "authorization_code",
    }),
  });

  if (!tokenRes.ok) {
    console.error("[google-oauth] token exchange failed", tokenRes.status, await tokenRes.text());
    return redirectWithError(origin, "google_auth_failed");
  }

  const tokens = (await tokenRes.json()) as GoogleTokenResponse;

  const userInfoRes = await fetch("https://www.googleapis.com/oauth2/v3/userinfo", {
    headers: { Authorization: `Bearer ${tokens.access_token}` },
  });

  if (!userInfoRes.ok) {
    console.error("[google-oauth] userinfo fetch failed", userInfoRes.status, await userInfoRes.text());
    return redirectWithError(origin, "google_auth_failed");
  }

  const profile = (await userInfoRes.json()) as GoogleUserInfo;

  if (!profile.email || !profile.email_verified) {
    return redirectWithError(origin, "google_email_unverified");
  }

  const email = profile.email.toLowerCase();

  let user = db
    .prepare("SELECT id, email, google_id FROM users WHERE google_id = ? OR email = ?")
    .get(profile.sub, email) as UserRow | undefined;

  const isNewUser = !user;

  if (!user) {
    const randomPassword = crypto.randomBytes(32).toString("hex");
    const password_hash = await bcrypt.hash(randomPassword, 12);
    const result = db
      .prepare("INSERT INTO users (email, password_hash, google_id) VALUES (?, ?, ?)")
      .run(email, password_hash, profile.sub);
    const userId = result.lastInsertRowid as number;
    db.prepare("INSERT INTO user_settings (user_id) VALUES (?)").run(userId);
    user = { id: userId, email, google_id: profile.sub };
  } else if (!user.google_id) {
    db.prepare("UPDATE users SET google_id = ? WHERE id = ?").run(profile.sub, user.id);
  }

  const token = await signToken({ userId: user.id, email: user.email });
  await setSessionCookie(token);

  if (!isNewUser) {
    const settings = db
      .prepare("SELECT login_notifications FROM user_settings WHERE user_id = ?")
      .get(user.id) as SettingsRow | undefined;

    if (settings?.login_notifications) {
      const ip =
        request.headers.get("x-forwarded-for")?.split(",")[0].trim() ??
        request.headers.get("x-real-ip") ??
        "Unknown";
      const userAgent = request.headers.get("user-agent") ?? "Unknown";
      sendLoginNotificationEmail(user.email, { ip, userAgent, baseUrl: origin }).catch((err) =>
        console.error("[google-oauth] login notification email failed", err)
      );
    }
  }

  const response = NextResponse.redirect(new URL("/settings", origin));
  response.cookies.delete("google_oauth_state");
  return response;
}
