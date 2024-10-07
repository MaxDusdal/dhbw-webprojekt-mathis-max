import { NextRequest, NextResponse } from "next/server";
import { comparePassword } from "~/app/utils/passwordHelper";
import { credentialsSchema } from "~/app/utils/zod";
import { lucia } from "~/auth";
import { db } from "~/server/db";
// Add these imports
import { UAParser } from 'ua-parser-js';

// TODO: Remove this
import geoip from 'geoip-lite';

export async function POST(req: NextRequest, res: NextResponse) {
  // Extract IP address, device info, and location
  const ip = req.headers.get('x-forwarded-for') || req.ip || 'Unknown';
  const userAgent = req.headers.get('user-agent') || 'Unknown';
  // TODO: Fix this
  const parser = new UAParser(userAgent);
  const device = parser.getDevice();
  console.log(device);

  // Log the extracted information
  // TODO: partially working, add to session creation
  console.log({
    ip,
    device: device.type || 'Unknown',
  });

  const input = await req.json();
  const parsedInput = credentialsSchema.parse(input);

  const user = await db.user.findUnique({
    where: { email: parsedInput.email },
  });

  if (!user) {
    return NextResponse.json({ error: "User or password incorrect" }, { status: 404 });
  }

  const isPasswordCorrect = await comparePassword(
    parsedInput.password,
    user.hash,
  );

  if (!isPasswordCorrect) {
    return NextResponse.json({ error: "User or password incorrect" }, { status: 401 });
  }

  const session = await lucia.createSession(user.id, {});
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
