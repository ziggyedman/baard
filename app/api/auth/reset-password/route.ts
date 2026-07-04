import { NextRequest } from "next/server";
import db from "@/lib/db";
import { hashToken, generateResetToken } from "@/lib/auth";
import { sendPasswordResetEmail } from "@/lib/email";
import { getAppUrl } from "@/lib/url";

interface UserRow {
  id: number;
}

export async function POST(request: NextRequest) {
  const { email } = await request.json();

  if (!email) {
    return Response.json({ error: "Email is required" }, { status: 400 });
  }

  const user = db.prepare("SELECT id FROM users WHERE email = ?").get(
    email.toLowerCase()
  ) as UserRow | undefined;

  if (user) {
    const token = generateResetToken();
    const tokenHash = hashToken(token);
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;

    db.prepare(
      "INSERT INTO password_reset_tokens (user_id, token_hash, expires_at) VALUES (?, ?, ?)"
    ).run(user.id, tokenHash, expiresAt);

    const baseUrl = getAppUrl(request);
    await sendPasswordResetEmail(email.toLowerCase(), token, baseUrl).catch((err) =>
      console.error("[reset-password] failed to send email", err)
    );
  }

  return Response.json({ ok: true });
}
