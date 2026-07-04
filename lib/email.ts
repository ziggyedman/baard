import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@baard.cc";

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
  const url = `${baseUrl}/reset-password/confirm?token=${token}`;
  const templateId = process.env.RESEND_RESET_PASSWORD_TEMPLATE_ID;
  const firstName = email.split("@")[0];

  if (templateId) {
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
  } else {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "Reset your baard.cc password",
      html: `
        <p>Hi,</p>
        <p>You requested a password reset for your baard.cc account.</p>
        <p><a href="${url}">Click here to reset your password</a></p>
        <p>This link expires in 1 hour. If you didn't request this, you can ignore this email.</p>
      `,
    });
  }
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
  const templateId = process.env.RESEND_LOGIN_TEMPLATE_ID;
  const now = new Date();
  const firstName = email.split("@")[0];
  const signInTime = now.toLocaleString("en-GB", {
    day: "numeric", month: "long", year: "numeric",
    hour: "2-digit", minute: "2-digit", timeZoneName: "short",
  });

  if (templateId) {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "New sign-in to baard.cc",
      template: {
        id: templateId,
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
  } else {
    await getResend().emails.send({
      from: FROM,
      to: email,
      subject: "New sign-in to baard.cc",
      html: `<p>A new sign-in to your baard.cc account was detected at ${signInTime} from ${ctx.ip}. If this wasn't you, reset your password immediately.</p>`,
    });
  }
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

  const postUrl = `${baseUrl}/blog/${post.slug}`;
  const { data, error } = await getResend().broadcasts.create({
    name: `Blog: ${post.title}`,
    from: FROM,
    subject: post.title,
    segmentId,
    html: `
      <h1>${post.title}</h1>
      <p>${post.excerpt}</p>
      <p><a href="${postUrl}">Read the full post</a></p>
      <hr />
      <p style="font-size:12px;color:#888;">
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a> from blog updates.
      </p>
    `,
    send: true,
  });
  if (error) throw new Error(error.message);
  return data!.id;
}

export async function sendNewsletterBroadcast(subject: string, contentHtml: string): Promise<string> {
  const segmentId = blogSegmentId();
  if (!segmentId) throw new Error("RESEND_BLOG_SEGMENT_ID is not set");

  const { data, error } = await getResend().broadcasts.create({
    name: `Newsletter: ${subject}`,
    from: FROM,
    subject,
    segmentId,
    html: `
      ${contentHtml}
      <hr />
      <p style="font-size:12px;color:#888;">
        <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a> from the newsletter.
      </p>
    `,
    send: true,
  });
  if (error) throw new Error(error.message);
  return data!.id;
}
