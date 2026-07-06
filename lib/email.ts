import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@baard.cc";
const LOGIN_TEMPLATE_ID = process.env.RESEND_LOGIN_TEMPLATE_ID || "a1dc3d9d-6644-4215-ae4c-22383532a4e8";

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

// Resend's Broadcasts API takes raw html/text/react — it has no `template.id` option like
// emails.send() does. To still author broadcast content as a reusable dashboard template,
// fetch the template's html and fill in our own {{{placeholders}}}. Placeholders we don't
// know about (e.g. {{{RESEND_UNSUBSCRIBE_URL}}}, contact properties) are left untouched so
// Resend can resolve them per-recipient when the broadcast actually sends.
async function renderBroadcastTemplate(
  templateId: string,
  vars: Record<string, string>
): Promise<string> {
  const { data, error } = await getResend().templates.get(templateId);
  if (error) throw new Error(error.message);
  if (!data) throw new Error(`Resend template ${templateId} not found`);

  let html = data.html;
  for (const [key, value] of Object.entries(vars)) {
    html = html.replaceAll(`{{{${key}}}}`, value);
  }
  return html;
}

function parseUserAgent(userAgent: string): string {
  let os = "an unknown OS";
  if (/Windows/.test(userAgent)) os = "Windows";
  else if (/iPhone|iPad|iPod/.test(userAgent)) os = "iOS";
  else if (/Mac OS X/.test(userAgent)) os = "macOS";
  else if (/Android/.test(userAgent)) os = "Android";
  else if (/Linux/.test(userAgent)) os = "Linux";

  let browser = "an unknown browser";
  if (/Edg\//.test(userAgent)) browser = "Edge";
  else if (/Chrome\//.test(userAgent) && !/Chromium/.test(userAgent)) browser = "Chrome";
  else if (/Firefox\//.test(userAgent)) browser = "Firefox";
  else if (/Safari\//.test(userAgent) && !/Chrome/.test(userAgent)) browser = "Safari";

  return `${browser} on ${os}`;
}

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  const templateId = process.env.RESEND_RESET_PASSWORD_TEMPLATE_ID;
  if (!templateId) throw new Error("RESEND_RESET_PASSWORD_TEMPLATE_ID is not set");

  const url = `${baseUrl}/reset-password/confirm?token=${token}`;
  const firstName = email.split("@")[0];

  await getResend().emails.send({
    to: email,
    template: {
      id: templateId,
      variables: {
        first_name: firstName,
        reset_url: url,
        support_url: `${baseUrl}/#connect`,
        company_name: "baard.cc",
        company_address: process.env.COMPANY_ADDRESS ?? "",
      },
    },
  });
}

interface LoginNotificationContext {
  ip: string;
  userAgent: string;
  baseUrl: string;
}

export async function sendLoginNotificationEmail(
  email: string,
  ctx: LoginNotificationContext
) {
  const now = new Date();
  const firstName = email.split("@")[0];
  const signInTime = now.toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  await getResend().emails.send({
    from: FROM,
    to: email,
    subject: "New sign-in to baard.cc",
    template: {
      id: LOGIN_TEMPLATE_ID,
      variables: {
        app_name: "baard.cc",
        company_address: process.env.COMPANY_ADDRESS ?? "",
        device: parseUserAgent(ctx.userAgent),
        first_name: firstName,
        ip_address: ctx.ip,
        location: "Unknown",
        secure_account_url: `${ctx.baseUrl}/settings`,
        sign_in_time: signInTime,
        support_url: `${ctx.baseUrl}/#connect`,
      },
    },
  });
}

function blogSegmentId(): string | undefined {
  return process.env.RESEND_BLOG_SEGMENT_ID;
}

export async function subscribeToBlog(email: string): Promise<string | null> {
  const segmentId = blogSegmentId();
  const { data: existing } = await getResend().contacts.get({ email });

  if (existing) {
    await getResend().contacts.update({ email, unsubscribed: false });
    if (segmentId) {
      await getResend().contacts.segments.add({ contactId: existing.id, segmentId });
    }
    return existing.id;
  }

  const { data: created, error } = await getResend().contacts.create({
    email,
    unsubscribed: false,
    segments: segmentId ? [{ id: segmentId }] : undefined,
  });
  if (error) throw new Error(error.message);
  return created?.id ?? null;
}

export async function unsubscribeFromBlog(email: string): Promise<void> {
  const { data: existing } = await getResend().contacts.get({ email });
  if (!existing) return;
  await getResend().contacts.update({ email, unsubscribed: true });
}

export async function getBlogSubscriptionStatus(email: string): Promise<boolean> {
  const { data } = await getResend().contacts.get({ email });
  return !!data && !data.unsubscribed;
}

interface BlogPostSummary {
  title: string;
  excerpt: string;
  slug: string;
}

export async function sendBlogBroadcast(post: BlogPostSummary, baseUrl: string): Promise<string> {
  const segmentId = blogSegmentId();
  if (!segmentId) throw new Error("RESEND_BLOG_SEGMENT_ID is not set");
  const templateId = process.env.RESEND_BLOG_POST_TEMPLATE_ID;
  if (!templateId) throw new Error("RESEND_BLOG_POST_TEMPLATE_ID is not set");

  const html = await renderBroadcastTemplate(templateId, {
    post_title: escapeHtml(post.title),
    post_excerpt: escapeHtml(post.excerpt),
    post_url: `${baseUrl}/blog/${post.slug}`,
  });

  const { data, error } = await getResend().broadcasts.create({
    name: `Blog: ${post.title}`,
    from: FROM,
    subject: post.title,
    segmentId,
    html,
    send: true,
  });
  if (error) throw new Error(error.message);
  return data!.id;
}

export async function sendNewsletterBroadcast(subject: string, contentHtml: string): Promise<string> {
  const segmentId = blogSegmentId();
  if (!segmentId) throw new Error("RESEND_BLOG_SEGMENT_ID is not set");
  const templateId = process.env.RESEND_NEWSLETTER_TEMPLATE_ID;
  if (!templateId) throw new Error("RESEND_NEWSLETTER_TEMPLATE_ID is not set");

  const html = await renderBroadcastTemplate(templateId, {
    newsletter_subject: escapeHtml(subject),
    newsletter_content: contentHtml,
  });

  const { data, error } = await getResend().broadcasts.create({
    name: `Newsletter: ${subject}`,
    from: FROM,
    subject,
    segmentId,
    html,
    send: true,
  });
  if (error) throw new Error(error.message);
  return data!.id;
}
