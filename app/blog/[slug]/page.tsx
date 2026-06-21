import { notFound } from "next/navigation";
import Link from "next/link";
import db from "@/lib/db";
import BlogSubscribeWidget from "../BlogSubscribeWidget";

export const dynamic = "force-dynamic";

interface PostRow {
  title: string;
  content_html: string;
  published_at: number;
}

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function BlogPostPage({ params }: Props) {
  const { slug } = await params;
  const post = db
    .prepare("SELECT title, content_html, published_at FROM posts WHERE slug = ?")
    .get(slug) as PostRow | undefined;

  if (!post) notFound();

  return (
    <main
      className="min-h-screen px-6 py-20 md:px-16 md:py-32 grain"
      style={{ backgroundColor: "var(--color-navy)" }}
    >
      <div className="max-w-2xl mx-auto">
        <Link
          href="/blog"
          className="block mb-8 text-xs tracking-[0.3em] uppercase"
          style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.5 }}
        >
          ← Back to blog
        </Link>

        <h1
          className="uppercase leading-none mb-2"
          style={{
            fontFamily: "var(--font-bebas)",
            color: "var(--color-gold)",
            fontSize: "clamp(2.5rem, 8vw, 4.5rem)",
          }}
        >
          {post.title}
        </h1>
        <p className="mb-10 text-xs tracking-[0.2em] uppercase" style={{ fontFamily: "var(--font-bebas)", color: "var(--color-cream)", opacity: 0.4 }}>
          {new Date(post.published_at * 1000).toLocaleDateString("en-GB", { day: "numeric", month: "long", year: "numeric" })}
        </p>

        <div className="blog-content mb-16" dangerouslySetInnerHTML={{ __html: post.content_html }} />

        <hr className="section-rule mb-12" style={{ borderColor: "var(--color-cream)" }} />

        <BlogSubscribeWidget />
      </div>
    </main>
  );
}
