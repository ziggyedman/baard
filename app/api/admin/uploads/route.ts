import { NextRequest } from "next/server";
import crypto from "crypto";
import path from "path";
import fs from "fs/promises";
import { requireAdminSession } from "@/lib/auth";
import { UPLOADS_DIR, extensionForMimeType } from "@/lib/uploads";

const MAX_SIZE = 8 * 1024 * 1024;

export async function POST(request: NextRequest) {
  const admin = await requireAdminSession();
  if (!admin) return Response.json({ error: "Forbidden" }, { status: 403 });

  const formData = await request.formData();
  const file = formData.get("file");

  if (!(file instanceof File)) {
    return Response.json({ error: "No file provided" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return Response.json({ error: "File too large (max 8MB)" }, { status: 400 });
  }

  const ext = extensionForMimeType(file.type);
  if (!ext) {
    return Response.json({ error: "Unsupported file type" }, { status: 400 });
  }

  const filename = `${crypto.randomBytes(16).toString("hex")}.${ext}`;
  const buffer = Buffer.from(await file.arrayBuffer());
  await fs.writeFile(path.join(UPLOADS_DIR, filename), buffer);

  return Response.json({ url: `/api/uploads/${filename}` });
}
