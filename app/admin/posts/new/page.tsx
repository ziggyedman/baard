import { redirect } from "next/navigation";
import { getSession, isAdminEmail } from "@/lib/auth";
import PostForm from "../PostForm";

export default async function NewPostPage() {
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
          New Post
        </h1>
        <PostForm />
      </div>
    </main>
  );
}
