import { redirect, notFound } from "next/navigation";
import { getSession, isAdminEmail } from "@/lib/auth";
import db from "@/lib/db";
import PostForm from "../../PostForm";

interface PostRow {
  id: number;
  slug: string;
  title: string;
  excerpt: string;
  content_html: string;
}

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/blog");

  const { id } = await params;
  const post = db.prepare("SELECT id, slug, title, excerpt, content_html FROM posts WHERE id = ?").get(id) as
    | PostRow
    | undefined;
  if (!post) notFound();

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
          Edit Post
        </h1>
        <PostForm
          postId={post.id}
          initialTitle={post.title}
          initialExcerpt={post.excerpt}
          initialContentHtml={post.content_html}
          initialSlug={post.slug}
        />
      </div>
    </main>
  );
}
