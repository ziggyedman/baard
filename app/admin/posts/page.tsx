import { redirect } from "next/navigation";
import Link from "next/link";
import { getSession, isAdminEmail } from "@/lib/auth";
import db from "@/lib/db";
import NotifyButton from "./NotifyButton";

interface PostRow {
  id: number;
  slug: string;
  title: string;
  published_at: number;
  broadcast_sent_at: number | null;
}

export default async function AdminPostsPage() {
  const session = await getSession();
  if (!session) redirect("/login");
  if (!isAdminEmail(session.email)) redirect("/blog");

  const posts = db
    .prepare("SELECT id, slug, title, published_at, broadcast_sent_at FROM posts ORDER BY published_at DESC")
    .all() as PostRow[];

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-10">
          <h1
            className="uppercase leading-none"
            style={{
              fontFamily: "var(--font-bebas)",
              color: "var(--color-gold)",
              fontSize: "clamp(2.5rem, 7vw, 4rem)",
            }}
          >
            Posts
          </h1>
          <div className="flex items-center gap-3">
            <Link
              href="/admin/newsletter"
              className="px-5 py-2.5 uppercase tracking-[0.15em] text-sm"
              style={{ fontFamily: "var(--font-bebas)", border: "2px solid rgba(245,239,224,0.25)", color: "var(--color-cream)" }}
            >
              Newsletter
            </Link>
            <Link
              href="/admin/posts/new"
              className="px-5 py-2.5 uppercase tracking-[0.15em] text-sm"
              style={{ fontFamily: "var(--font-bebas)", backgroundColor: "var(--color-coral)", color: "var(--color-cream)" }}
            >
              New Post
            </Link>
          </div>
        </div>

        <hr className="section-rule mb-10" style={{ borderColor: "var(--color-cream)" }} />

        <div className="flex flex-col gap-6">
          {posts.length === 0 && (
            <p style={{ color: "var(--color-cream)", opacity: 0.5 }}>No posts yet.</p>
          )}
          {posts.map((post) => (
            <div key={post.id} className="flex items-center justify-between gap-4 pb-6" style={{ borderBottom: "1px solid rgba(245,239,224,0.1)" }}>
              <div>
                <Link
                  href={`/admin/posts/${post.id}/edit`}
                  className="uppercase leading-none"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "1.25rem" }}
                >
                  {post.title}
                </Link>
                <p className="text-xs mt-1" style={{ color: "var(--color-cream)", opacity: 0.5 }}>
                  {new Date(post.published_at * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
                  {post.broadcast_sent_at && " · Notified subscribers"}
                </p>
              </div>
              <NotifyButton postId={post.id} alreadySent={!!post.broadcast_sent_at} />
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
