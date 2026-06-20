import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

function getSecret(): Uint8Array {
  return new TextEncoder().encode(process.env.JWT_SECRET ?? "");
}

export async function proxy(request: NextRequest) {
  const token = request.cookies.get("session")?.value;
  if (token) {
    try {
      await jwtVerify(token, getSecret());
      return;
    } catch {
      // fall through to redirect
    }
  }
  return NextResponse.redirect(new URL("/login", request.url));
}

export const config = {
  matcher: ["/settings"],
};
