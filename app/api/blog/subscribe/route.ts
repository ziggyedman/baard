import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setBlogSubscription } from "@/lib/blogSubscription";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json().catch(() => ({}));

  const email = session ? session.email : (typeof body.email === "string" ? body.email.toLowerCase().trim() : "");

  if (!email || !EMAIL_RE.test(email)) {
    return Response.json({ error: "A valid email is required" }, { status: 400 });
  }

  try {
    await setBlogSubscription({ userId: session?.userId, email, subscribed: true });
  } catch (err) {
    console.error("[blog-subscribe] failed", err);
    return Response.json({ error: "Failed to subscribe" }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true, email });
  if (!session) {
    response.cookies.set("blog_sub_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365,
      path: "/",
    });
  }
  return response;
}
