import { requireAdminSession } from "@/lib/auth";
import { Resend } from "resend";
import db from "@/lib/db";

interface SettingsRow {
  blog_subscribed: number;
}

export async function GET() {
  const session = await requireAdminSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const loginTemplateId = process.env.RESEND_LOGIN_TEMPLATE_ID;
  const blogSegmentId = process.env.RESEND_BLOG_SEGMENT_ID;

  const dbSettings = db
    .prepare("SELECT blog_subscribed FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  const config = {
    RESEND_API_KEY: apiKey ? `set (starts with ${apiKey.slice(0, 6)}…)` : "NOT SET",
    RESEND_FROM_EMAIL: fromEmail ?? "NOT SET",
    RESEND_LOGIN_TEMPLATE_ID: loginTemplateId ?? "NOT SET",
    RESEND_BLOG_SEGMENT_ID: blogSegmentId ?? "NOT SET",
    db_subscriptions: {
      blog_subscribed: !!dbSettings?.blog_subscribed,
    },
  };

  if (!apiKey) {
    return Response.json({ config, error: "RESEND_API_KEY is not set" });
  }

  const resend = new Resend(apiKey);
  const from = fromEmail ?? "onboarding@resend.dev";
  const now = new Date();

  const plainResult = await resend.emails.send({
    from,
    to: session.email,
    subject: "baard.cc — plain HTML test",
    html: "<p>Plain HTML test.</p>",
  });

  let templateResult = null;
  if (loginTemplateId) {
    templateResult = await resend.emails.send({
      from,
      to: session.email,
      subject: "baard.cc — template test",
      template: {
        id: loginTemplateId,
        variables: {
          app_name: "baard.cc",
          company_address: process.env.COMPANY_ADDRESS ?? "",
          device: "Debug test",
          first_name: session.email.split("@")[0],
          ip_address: "127.0.0.1",
          location: "Unknown",
          secure_account_url: "http://localhost:3000/settings",
          sign_in_time: now.toLocaleString("en-GB", {
            day: "numeric", month: "long", year: "numeric",
            hour: "2-digit", minute: "2-digit", timeZoneName: "short",
          }),
          support_url: "http://localhost:3000/#connect",
        },
      },
    });
  }

  return Response.json({
    config,
    to: session.email,
    plain_send: { data: plainResult.data, error: plainResult.error },
    template_send: templateResult
      ? { data: templateResult.data, error: templateResult.error }
      : "skipped — RESEND_LOGIN_TEMPLATE_ID not set",
  });
}
