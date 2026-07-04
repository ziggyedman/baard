import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { hashToken } from "@/lib/auth";

interface TokenRow {
  id: number;
  user_id: number;
  expires_at: number;
  used: number;
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();

    if (!token || !password) {
      return Response.json({ error: "Token and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const tokenHash = hashToken(token);
    const row = db
      .prepare("SELECT id, user_id, expires_at, used FROM password_reset_tokens WHERE token_hash = ?")
      .get(tokenHash) as TokenRow | undefined;

    if (!row || row.used || row.expires_at < Math.floor(Date.now() / 1000)) {
      return Response.json({ error: "Invalid or expired reset link" }, { status: 400 });
    }

    const password_hash = await bcrypt.hash(password, 12);

    db.transaction(() => {
      db.prepare("UPDATE users SET password_hash = ? WHERE id = ?").run(password_hash, row.user_id);
      db.prepare("UPDATE password_reset_tokens SET used = 1 WHERE id = ?").run(row.id);
    })();

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[reset-password-confirm] unexpected error", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
