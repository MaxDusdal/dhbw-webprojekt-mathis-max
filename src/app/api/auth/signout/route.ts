import { NextRequest, NextResponse } from "next/server";
import { lucia } from "~/auth";

export async function POST(req: NextRequest, res: NextResponse) {
  const sessionId = req.cookies.get(lucia.sessionCookieName)?.value ?? null;
  if (!sessionId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  await lucia.invalidateSession(sessionId);
  const blankSessionCookie = lucia.createBlankSessionCookie();

  const response = NextResponse.redirect(new URL("/login", req.url));

  response.headers.set("Set-Cookie", blankSessionCookie.serialize());

  return response;
}
