import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth";
import SettingsForm from "./SettingsForm";

export default async function SettingsPage() {
  const session = await getSession();
  if (!session) redirect("/login");

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-2xl mx-auto">
        <p
          className="text-sm tracking-[0.4em] uppercase mb-2"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          Your Account
        </p>
        <h1
          className="uppercase leading-none mb-2"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 9vw, 6rem)",
          }}
        >
          Settings
        </h1>
        <p
          className="mb-10 text-sm"
          style={{ color: "var(--color-cream)", opacity: 0.5 }}
        >
          Signed in as <strong>{session.email}</strong>
        </p>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        <SettingsForm />
      </div>
    </main>
  );
}
