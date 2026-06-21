import Link from "next/link";
import db from "@/lib/db";
import BlogSubscribeWidget from "./BlogSubscribeWidget";

export const dynamic = "force-dynamic";

interface PostRow {
  slug: string;
  title: string;
  excerpt: string;
  published_at: number;
}

export default function BlogPage() {
  const posts = db
    .prepare("SELECT slug, title, excerpt, published_at FROM posts ORDER BY published_at DESC")
    .all() as PostRow[];

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-2xl mx-auto">
        <h1
          className="uppercase leading-none mb-10"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(3rem, 9vw, 6rem)",
          }}
        >
          Blog
        </h1>

        <div className="mb-12">
          <BlogSubscribeWidget />
        </div>

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        <div className="flex flex-col gap-10">
          {posts.length === 0 && (
            <p style={{ color: "var(--color-cream)", opacity: 0.5 }}>No posts yet — check back soon.</p>
          )}
          {posts.map((post) => (
            <article key={post.slug}>
              <Link href={`/blog/${post.slug}`}>
                <h2
                  className="uppercase leading-none mb-2"
                  style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", fontSize: "2rem" }}
                >
                  {post.title}
                </h2>
              </Link>
              <p className="text-xs tracking-[0.2em] uppercase mb-3" style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.4 }}>
                {new Date(post.published_at * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
              </p>
              {post.excerpt && (
                <p className="text-sm mb-3" style={{ color: "var(--color-cream)", opacity: 0.7 }}>
                  {post.excerpt}
                </p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="text-xs tracking-[0.15em] uppercase"
                style={{ fontFamily: "var(--font-bebas)", color: "var(--color-coral)" }}
              >
                Read more →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </main>
  );
}
