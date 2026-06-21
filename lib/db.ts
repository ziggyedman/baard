import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "baard.db");

const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

const db = new Database(dbPath);

db.pragma("journal_mode = WAL");
db.pragma("foreign_keys = ON");

db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    password_hash TEXT NOT NULL,
    google_id TEXT,
    created_at INTEGER NOT NULL DEFAULT (unixepoch())
  );

  CREATE TABLE IF NOT EXISTS password_reset_tokens (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash TEXT NOT NULL UNIQUE,
    expires_at INTEGER NOT NULL,
    used INTEGER NOT NULL DEFAULT 0
  );

  CREATE TABLE IF NOT EXISTS user_settings (
    user_id INTEGER PRIMARY KEY REFERENCES users(id) ON DELETE CASCADE,
    blog_subscribed INTEGER NOT NULL DEFAULT 0,
    login_notifications INTEGER NOT NULL DEFAULT 1,
    resend_contact_id TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    slug TEXT NOT NULL UNIQUE,
    title TEXT NOT NULL,
    excerpt TEXT NOT NULL DEFAULT '',
    content_html TEXT NOT NULL,
    published_at INTEGER NOT NULL DEFAULT (unixepoch()),
    broadcast_id TEXT,
    broadcast_sent_at INTEGER
  );
`);

// Schema migrations below run from every process that imports this module (including
// Next.js's parallel build workers), so concurrent runs can race: one process's ALTER
// may land between another's existence check and its own ALTER. Swallow the resulting
// "duplicate column" / "no such column" errors — they just mean another process won.
function safeAlter(sql: string) {
  try {
    db.exec(sql);
  } catch (err) {
    if (err instanceof Error && /duplicate column|no such column/i.test(err.message)) return;
    throw err;
  }
}

const userColumns = db.prepare("PRAGMA table_info(users)").all() as { name: string }[];
if (!userColumns.some((c) => c.name === "google_id")) {
  safeAlter("ALTER TABLE users ADD COLUMN google_id TEXT");
}
db.exec("CREATE UNIQUE INDEX IF NOT EXISTS idx_users_google_id ON users(google_id)");

const settingsColumns = db.prepare("PRAGMA table_info(user_settings)").all() as { name: string }[];
if (settingsColumns.some((c) => c.name === "newsletter_1")) {
  safeAlter("ALTER TABLE user_settings RENAME COLUMN newsletter_1 TO blog_subscribed");
}
if (settingsColumns.some((c) => c.name === "resend_contact_id_1")) {
  safeAlter("ALTER TABLE user_settings RENAME COLUMN resend_contact_id_1 TO resend_contact_id");
}
for (const col of ["newsletter_2", "newsletter_3", "resend_contact_id_2", "resend_contact_id_3"]) {
  if (settingsColumns.some((c) => c.name === col)) {
    safeAlter(`ALTER TABLE user_settings DROP COLUMN ${col}`);
  }
}

export default db;
