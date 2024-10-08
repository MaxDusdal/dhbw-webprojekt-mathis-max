// src/app/api/auth/signup/route.ts
import { type NextRequest, NextResponse } from "next/server";
import { saltAndHashPassword } from "~/app/utils/passwordHelper";
import { signUpSchema } from "~/app/utils/zod";
import { lucia } from "~/auth";
import { db } from "~/server/db";

export async function POST(req: NextRequest, res: NextResponse) {
  const input = await req.json();
  const parsedInput = signUpSchema.parse(input);

  const { salt, hash } = await saltAndHashPassword(parsedInput.password, 10);

  const existingUser = await db.user.findUnique({
    where: { email: parsedInput.email },
  });

  if (existingUser) {
    return NextResponse.json({ error: "User already exists" }, { status: 400 });
  }

  const newUser = await db.user.create({
    data: {
      firstName: parsedInput.firstName,
      lastName: parsedInput.lastName,
      email: parsedInput.email,
      salt,
      hash,
      role: "USER",
      avatar: "",
    },
  });

  const session = await lucia.createSession(newUser.id, {});
  const sessionCookie = lucia.createSessionCookie(session.id);

  const response = NextResponse.json(
    {
      user: {
        id: newUser.id,
        email: newUser.email,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        role: newUser.role,
      },
    },
    { status: 201 },
  );
  console.log(sessionCookie.serialize());
  response.headers.set("Set-Cookie", sessionCookie.serialize());

  return response;
}
