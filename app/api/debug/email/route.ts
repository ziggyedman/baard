import { getSession } from "@/lib/auth";
import { Resend } from "resend";
import db from "@/lib/db";
import { NEWSLETTERS } from "@/lib/email";

interface SettingsRow {
  newsletter_1: number;
  newsletter_2: number;
  newsletter_3: number;
}

export async function GET() {
  const session = await getSession();
  if (!session) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const fromEmail = process.env.RESEND_FROM_EMAIL;
  const loginTemplateId = process.env.RESEND_LOGIN_TEMPLATE_ID;

  const newsletterTemplateIds = NEWSLETTERS.map((nl) => ({
    name: nl.name,
    envKey: `RESEND_NEWSLETTER_TEMPLATE_ID_${nl.id}`,
    value: process.env[`RESEND_NEWSLETTER_TEMPLATE_ID_${nl.id}`] ?? null,
  }));

  const dbSettings = db
    .prepare("SELECT newsletter_1, newsletter_2, newsletter_3 FROM user_settings WHERE user_id = ?")
    .get(session.userId) as SettingsRow | undefined;

  const config = {
    RESEND_API_KEY: apiKey ? `set (starts with ${apiKey.slice(0, 6)}…)` : "NOT SET",
    RESEND_FROM_EMAIL: fromEmail ?? "NOT SET",
    RESEND_LOGIN_TEMPLATE_ID: loginTemplateId ?? "NOT SET",
    newsletter_templates: newsletterTemplateIds.map((n) => ({
      name: n.name,
      env_key: n.envKey,
      status: n.value ? `set (${n.value})` : "NOT SET",
    })),
    db_subscriptions: {
      newsletter_1: !!dbSettings?.newsletter_1,
      newsletter_2: !!dbSettings?.newsletter_2,
      newsletter_3: !!dbSettings?.newsletter_3,
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

  const newsletterResults = await Promise.all(
    newsletterTemplateIds.map(async (nl) => {
      if (!nl.value) return { name: nl.name, result: "skipped — template ID not set" };
      const r = await resend.emails.send({
        from,
        to: session.email,
        subject: nl.name,
        template: {
          id: nl.value,
          variables: {
            email: session.email,
            first_name: session.email.split("@")[0],
            issue_month: now.toLocaleString("en-GB", { month: "long", year: "numeric" }),
          },
        },
      });
      return { name: nl.name, data: r.data, error: r.error };
    })
  );

  return Response.json({
    config,
    to: session.email,
    plain_send: { data: plainResult.data, error: plainResult.error },
    template_send: templateResult
      ? { data: templateResult.data, error: templateResult.error }
      : "skipped — RESEND_LOGIN_TEMPLATE_ID not set",
    newsletter_sends: newsletterResults,
  });
}
