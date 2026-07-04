import { redirect } from "next/navigation";
import { getSession, isAdminEmail } from "@/lib/auth";
import NewsletterForm from "../NewsletterForm";

export default async function NewNewsletterIssuePage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/blog");

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
          New Issue
        </h1>
        <NewsletterForm />
      </div>
    </main>
  );
}
