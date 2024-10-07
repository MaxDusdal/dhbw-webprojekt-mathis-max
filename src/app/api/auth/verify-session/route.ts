import { NextRequest, NextResponse } from "next/server";
import { lucia } from "~/auth";

export async function GET(req: NextRequest, res: NextResponse) {
  const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null;

  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { session } = await lucia.validateSession(sessionId);

  if (!session) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
