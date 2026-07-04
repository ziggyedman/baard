import type { NextRequest } from "next/server";

export function getAppUrl(request: NextRequest): string {
  return process.env.APP_URL ?? request.nextUrl.origin;
}
