import { NextRequest, NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { setBlogSubscription } from "@/lib/blogSubscription";

export async function POST(request: NextRequest) {
  const session = await getSession();
  const body = await request.json().catch(() => ({}));

  const email = session
    ? session.email
    : (typeof body.email === "string" ? body.email.toLowerCase().trim() : request.cookies.get("blog_sub_email")?.value);

  if (!email) {
    return Response.json({ error: "No email to unsubscribe" }, { status: 400 });
  }

  try {
    await setBlogSubscription({ userId: session?.userId, email, subscribed: false });
  } catch (err) {
    console.error("[blog-unsubscribe] failed", err);
    return Response.json({ error: "Failed to unsubscribe" }, { status: 502 });
  }

  const response = NextResponse.json({ ok: true, email });
  if (!session) {
    response.cookies.delete("blog_sub_email");
  }
  return response;
}
