import { NextRequest } from "next/server";
import bcrypt from "bcryptjs";
import db from "@/lib/db";
import { signToken, setSessionCookie } from "@/lib/auth";

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return Response.json({ error: "Email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return Response.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }

    const existing = db.prepare("SELECT id FROM users WHERE email = ?").get(email.toLowerCase());
    if (existing) {
      return Response.json({ error: "An account with this email already exists" }, { status: 409 });
    }

    const password_hash = await bcrypt.hash(password, 12);
    const result = db
      .prepare("INSERT INTO users (email, password_hash) VALUES (?, ?)")
      .run(email.toLowerCase(), password_hash);

    const userId = result.lastInsertRowid as number;
    db.prepare("INSERT INTO user_settings (user_id) VALUES (?)").run(userId);

    const token = await signToken({ userId, email: email.toLowerCase() });
    await setSessionCookie(token);

    return Response.json({ ok: true });
  } catch (err) {
    console.error("[register] unexpected error", err);
    return Response.json({ error: "Something went wrong. Please try again." }, { status: 500 });
  }
}
