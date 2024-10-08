import { type NextRequest, NextResponse, userAgent } from "next/server";
import { comparePassword } from "~/app/utils/passwordHelper";
import { credentialsSchema } from "~/app/utils/zod";
import { lucia } from "~/auth";
import { db } from "~/server/db";
import { type GeoIPResponse, type UserAgentInfo } from "~/app/utils/types";
import { getLocation, getDeviceString } from "~/app/utils/sessionHelper";

export async function POST(req: NextRequest, res: NextResponse) {
  // Extract IP address, device info, and location
  const ip = req.headers.get("x-forwarded-for") || req.ip || "Unknown";
  const ua = userAgent(req);

  const input = await req.json();
  const parsedInput = credentialsSchema.parse(input);

  const user = await db.user.findUnique({
    where: { email: parsedInput.email },
  });

  if (!user) {
    return NextResponse.json(
      { error: "User or password incorrect" },
      { status: 404 },
    );
  }

  const isPasswordCorrect = await comparePassword(
    parsedInput.password,
    user.hash,
  );

  if (!isPasswordCorrect) {
    return NextResponse.json(
      { error: "User or password incorrect" },
      { status: 401 },
    );
  }

  const session = await lucia.createSession(user.id, {
    ipAddress: ip,
    device: getDeviceString(ua),
    location: await getLocation(ip),
  });
  const sessionCookie = lucia.createSessionCookie(session.id);

  const response = NextResponse.json(
    {
      success: true,
    },
    { status: 200 },
  );

  response.headers.set("Set-Cookie", sessionCookie.serialize());

  return response;
}
