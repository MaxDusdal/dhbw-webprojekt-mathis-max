import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export async function middleware(request: NextRequest) {
  try {
    const origin =
      process.env.NODE_ENV === "production"
        ? // eslint-disable-next-line no-restricted-properties
          `http://127.0.0.1:3000`
        : request.nextUrl.origin;
    // Verify session using an internal API endpoint
    const verifyRequest = await fetch(`${origin}/api/auth/verify-session`, {
      headers: { Cookie: request.headers.get("Cookie") || "" },
    });

    if (!verifyRequest.ok) {
      // Handle non-200 responses
      console.error(
        `Verify session failed: ${verifyRequest.status} ${verifyRequest.statusText}`,
      );
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    const verifySession = await verifyRequest.json();

    if (!verifySession.valid) {
      // Invalid session, redirect to auth page
      return NextResponse.redirect(new URL("/login", request.nextUrl));
    }

    // Valid session, continue to the requested page
    return NextResponse.next();
  } catch (error) {
    console.error("Error in middleware:", error);
    // In case of any error, redirect to login page
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }
}

export const config = {
  matcher: ["/protectedPage", "/settings/:path*"],
};
