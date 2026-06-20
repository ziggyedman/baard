import { Resend } from "resend";

let _resend: Resend | null = null;
function getResend(): Resend {
  if (!_resend) _resend = new Resend(process.env.RESEND_API_KEY ?? "");
  return _resend;
}

const FROM = process.env.RESEND_FROM_EMAIL ?? "hello@baard.cc";

const NEWSLETTERS = [
  { id: 1, name: "Monthly Update", audienceEnvKey: "RESEND_AUDIENCE_ID_1" },
  { id: 2, name: "Tech Notes", audienceEnvKey: "RESEND_AUDIENCE_ID_2" },
  { id: 3, name: "Life & Travel", audienceEnvKey: "RESEND_AUDIENCE_ID_3" },
] as const;

export { NEWSLETTERS };

function audienceId(envKey: string): string | undefined {
  return process.env[envKey];
}

export async function sendPasswordResetEmail(email: string, token: string, baseUrl: string) {
  const url = `${baseUrl}/reset-password/confirm?token=${token}`;
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
      from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
      to: email,
      subject: "New sign-in to baard.cc",
      template: {
        id: templateId,
        variables: {
          app_name: "baard.cc",
          company_address: process.env.COMPANY_ADDRESS ?? "",
          device: ctx.userAgent,
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

export async function sendNewsletterToUser(
  email: string,
  newsletterIndex: 0 | 1 | 2
) {
  const newsletter = NEWSLETTERS[newsletterIndex];
  const envKey = `RESEND_NEWSLETTER_TEMPLATE_ID_${newsletter.id}`;
  const templateId = process.env[envKey];
  if (!templateId) return;

  await getResend().emails.send({
    from: process.env.RESEND_FROM_EMAIL ?? "onboarding@resend.dev",
    to: email,
    subject: newsletter.name,
    template: {
      id: templateId,
      variables: {
        email,
        first_name: email.split("@")[0],
        issue_month: new Date().toLocaleString("en-GB", { month: "long", year: "numeric" }),
      },
    },
  });
}

export async function syncNewsletterSubscription(
  email: string,
  newsletterIndex: 0 | 1 | 2,
  subscribe: boolean,
  existingContactId: string | null
): Promise<string | null> {
  const newsletter = NEWSLETTERS[newsletterIndex];
  const aId = audienceId(newsletter.audienceEnvKey);
  if (!aId) return existingContactId;

  if (subscribe) {
    if (existingContactId) {
      await getResend().contacts.update({
        audienceId: aId,
        id: existingContactId,
        unsubscribed: false,
      });
      return existingContactId;
    } else {
      const result = await getResend().contacts.create({
        audienceId: aId,
        email,
        unsubscribed: false,
      });
      return (result.data as { id: string } | null)?.id ?? null;
    }
  } else {
    if (existingContactId) {
      await getResend().contacts.update({
        audienceId: aId,
        id: existingContactId,
        unsubscribed: true,
      });
    }
    return existingContactId;
  }
}
