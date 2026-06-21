import { getSession, isAdminEmail } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  return Response.json({
    email: session?.email ?? null,
    isAdmin: session ? isAdminEmail(session.email) : false,
  });
}
