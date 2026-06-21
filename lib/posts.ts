import db from "@/lib/db";

function slugify(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "post";
}

export function uniqueSlugFromTitle(title: string): string {
  const base = slugify(title);
  let slug = base;
  let suffix = 2;
  while (db.prepare("SELECT 1 FROM posts WHERE slug = ?").get(slug)) {
    slug = `${base}-${suffix}`;
    suffix++;
  }
  return slug;
}
