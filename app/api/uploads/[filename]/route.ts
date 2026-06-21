import path from "path";
import fs from "fs/promises";
import { UPLOADS_DIR, isValidUploadFilename } from "@/lib/uploads";

const CONTENT_TYPES: Record<string, string> = {
  png: "image/png",
  jpg: "image/jpeg",
  gif: "image/gif",
  webp: "image/webp",
};

interface Params {
  params: Promise<{ filename: string }>;
}

export async function GET(_request: Request, { params }: Params) {
  const { filename } = await params;

  if (!isValidUploadFilename(filename)) {
    return Response.json({ error: "Not found" }, { status: 404 });
  }

  const ext = filename.split(".").pop() as string;

  try {
    const data = await fs.readFile(path.join(UPLOADS_DIR, filename));
    return new Response(data, {
      headers: {
        "Content-Type": CONTENT_TYPES[ext],
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    });
  } catch {
    return Response.json({ error: "Not found" }, { status: 404 });
  }
}
