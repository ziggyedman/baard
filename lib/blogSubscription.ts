import db from "@/lib/db";
import { subscribeToBlog, unsubscribeFromBlog } from "@/lib/email";

interface SetBlogSubscriptionOptions {
  userId?: number;
  email: string;
  subscribed: boolean;
}

export async function setBlogSubscription({ userId, email, subscribed }: SetBlogSubscriptionOptions) {
  if (subscribed) {
    const contactId = await subscribeToBlog(email);
    if (userId) {
      db.prepare(
        "UPDATE user_settings SET blog_subscribed = 1, resend_contact_id = ? WHERE user_id = ?"
      ).run(contactId, userId);
    }
  } else {
    await unsubscribeFromBlog(email);
    if (userId) {
      db.prepare("UPDATE user_settings SET blog_subscribed = 0 WHERE user_id = ?").run(userId);
    }
  }
}
