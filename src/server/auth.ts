import {
  getServerSession,
  RequestInternal,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { credentialsSchema } from "~/app/utils/zod";
import { createUser, getUserFromDB } from "~/app/utils/authAdapter";
import {
  comparePassword,
  saltAndHashPassword,
} from "~/app/utils/passwordHelper";
import { Role, User } from "@prisma/client";
import { UserWithAuthRelevantInfo } from "~/app/utils/types";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "~/app/utils/prisma";
import { Adapter } from "next-auth/adapters";
import { v4 as uuid } from "uuid";
import {
  encode as defaultEncode,
  decode as defaultDecode,
} from "next-auth/jwt";

/**
 * Module augmentation for `next-auth` types. Allows us to add custom properties to the `session`
 * object and keep type safety.
 *
 * @see https://next-auth.js.org/getting-started/typescript#module-augmentation
 */
declare module "next-auth" {
  interface Session extends DefaultSession {
    user: {
      id: string;
      role: Role;
      email: string;
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
  interface User extends UserWithAuthRelevantInfo {}
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
// TODO: When user gets deleted, the session still holds the user id and therefore the session is not invalidated
export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as Adapter,
  callbacks: {
    async jwt({ token, user, account }) {
      if (account?.provider === "credentials") {
        token.credentials = true;
      }
      return token;
    },
  },
  jwt: {
    encode: async function (params) {
      if (params.token?.credentials) {
        const sessionToken = uuid();

        if (!params.token?.sub) {
          throw new Error("User id is required");
        }

        const session = await prisma?.session.create({
          data: {
            sessionToken,
            userId: params.token.sub as string,
            expires: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          },
        });

        if (!session) {
          throw new Error("Session could not be created");
        }

        return sessionToken;
      }
      return defaultEncode(params);
    },
  },
  pages: {
    signIn: "/login",
    error: "/login?error=true",
    signOut: "/rooms",
  },
  secret: process.env.NEXTAUTH_SECRET,
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (
        credentials: Record<"username" | "password", string> | undefined,
        req: Pick<RequestInternal, "body" | "query" | "headers" | "method">,
      ) => {
        const { email, password } = credentialsSchema.parse(credentials);

        console.log("email", email);
        const user: User | null = await getUserFromDB(email.toLowerCase());

        console.log("user", user);
        if (user) {
          console.log("User exists");
          // User exists, verify password
          const isPasswordValid = await comparePassword(password, user.hash);
          if (!isPasswordValid) {
            console.log("Password is invalid");
            return null;
          }
          console.log("Password is valid");
          // Password is valid, return user
          return {
            id: user.id,
            email: user.email,
            role: user.role,
            avatar: user.avatar,
            firstName: user.firstName,
            lastName: user.lastName,
          } as UserWithAuthRelevantInfo;
        } else {
          // Throw Error if user doesn't exist
          const { salt, hash } = await saltAndHashPassword(password);

          const newUser = await createUser({
            email,
            hash,
            salt,
            avatar: "",
            firstName: "",
            lastName: "",
          });

          return newUser;
        }
        return null;
      },
    }),
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
