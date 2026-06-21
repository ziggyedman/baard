import path from "path";
import fs from "fs";

const dbPath = process.env.DATABASE_PATH ?? path.join(process.cwd(), "data", "baard.db");
export const UPLOADS_DIR = path.join(path.dirname(dbPath), "uploads");

if (!fs.existsSync(UPLOADS_DIR)) {
  fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

const ALLOWED_TYPES: Record<string, string> = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/gif": "gif",
  "image/webp": "webp",
};

export function extensionForMimeType(mimeType: string): string | null {
  return ALLOWED_TYPES[mimeType] ?? null;
}

export function isValidUploadFilename(filename: string): boolean {
  return /^[a-f0-9]{32}\.(png|jpg|gif|webp)$/.test(filename);
}
