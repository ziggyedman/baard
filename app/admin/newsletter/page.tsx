import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, isAdminEmail } from "@/lib/auth";
import db from "@/lib/db";
import type { NewsletterIssueRow } from "@/app/api/admin/newsletter/route";

export default async function AdminNewsletterPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/blog");

  const issues = db
    .prepare("SELECT id, subject, created_at, sent_at FROM newsletter_issues ORDER BY created_at DESC")
    .all() as Pick<NewsletterIssueRow, "id" | "subject" | "created_at" | "sent_at">[];

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin/posts"
          className="block mb-6 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          ← Posts
        </Link>

        <div className="flex items-center justify-between mb-10">
          <h1
            className="uppercase leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "var(--color-gold)",
              fontSize: "clamp(2.5rem, 7vw, 4rem)",
            }}
          >
            Newsletter
          </h1>
          <Link
            href="/admin/newsletter/new"
            className="px-5 py-2.5 uppercase tracking-[0.15em] text-sm"
            style={{ fontFamily: "var(--font-bebas)", backgroundColor: "var(--color-coral)", color: "var(--color-cream)" }}
          >
            New Issue
          </Link>
        </div>

        <hr className="section-rule mb-10" style={{ borderColor: "var(--color-cream)" }} />

        <div className="flex flex-col gap-6">
          {issues.length === 0 && (
            <p style={{ color: "var(--color-cream)", opacity: 0.5 }}>No issues yet.</p>
          )}
          {issues.map((issue) => (
            <div
              key={issue.id}
              className="flex items-center justify-between gap-4 pb-6"
              style={{ borderBottom: "1px solid rgba(245,239,224,0.1)" }}
            >
              <div>
                <Link
                  href={`/admin/newsletter/${issue.id}/edit`}
                  className="uppercase leading-none"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.25rem" }}
                >
                  {issue.subject}
                </Link>
                <p className="text-xs mt-1" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
                  {new Date(issue.created_at * 1000).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                  {issue.sent_at ? " · Sent" : " · Draft"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
