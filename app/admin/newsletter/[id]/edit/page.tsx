import { redirect, notFound } from "next/navigation";
import { getSession, isAdminEmail } from "@/lib/auth";
import db from "@/lib/db";
import NewsletterForm from "../../NewsletterForm";

interface IssueRow {
  id: number;
  subject: string;
  content_html: string;
  sent_at: number | null;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditNewsletterIssuePage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/blog");

  const { id } = await params;
  const issue = db
    .prepare("SELECT id, subject, content_html, sent_at FROM newsletter_issues WHERE id = ?")
    .get(id) as IssueRow | undefined;
  if (!issue) notFound();

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-3xl mx-auto">
        <h1
          className="uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(2.5rem, 7vw, 4rem)",
          }}
        >
          Edit Issue
        </h1>
        <NewsletterForm
          issueId={issue.id}
          initialSubject={issue.subject}
          initialContentHtml={issue.content_html}
          sent={!!issue.sent_at}
        />
      </div>
    </main>
  );
}
