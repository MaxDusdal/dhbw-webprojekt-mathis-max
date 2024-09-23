import { PrismaAdapter } from "@auth/prisma-adapter";
import {
  getServerSession,
  RequestInternal,
  type DefaultSession,
  type NextAuthOptions,
} from "next-auth";
import { type Adapter } from "next-auth/adapters";
import DiscordProvider from "next-auth/providers/discord";
import CredentialsProvider from "next-auth/providers/credentials";

import { env } from "~/env";
import { db } from "~/server/db";
import { credentialsSchema } from "~/app/utils/zod";
import { createUser, getUserFromDB } from "~/app/utils/authAdapter";
import { comparePassword, saltAndHashPassword } from "~/app/utils/passwordHelper";

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
      // ...other properties
      // role: UserRole;
    } & DefaultSession["user"];
  }

  // interface User {
  //   // ...other properties
  //   // role: UserRole;
  // }
}

/**
 * Options for NextAuth.js used to configure adapters, providers, callbacks, etc.
 *
 * @see https://next-auth.js.org/configuration/options
 */
export const authOptions: NextAuthOptions = {
  callbacks: {
		jwt: async ({ token, user }) => {
			if (user) {
				token.id = user.id;
			}
			return token;
		},
		session: async ({ session, token }) => {
			if (session?.user) {
				session.user.id = token.id as string;
			}
			return session;
		},
	},
	pages: {
		signIn: "/login",
		error: "/login?error=true",
	},
	session: {
		strategy: "jwt",
	},
  adapter: PrismaAdapter(db) as Adapter,
  providers: [
    CredentialsProvider({
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      authorize: async (credentials: Record<"username" | "password", string> | undefined, req: Pick<RequestInternal, "body" | "query" | "headers" | "method">) => {
        const { email, password } = credentialsSchema.parse(credentials);

        const user = await getUserFromDB(email.toLowerCase());

        if (user) {
          // User exists, verify password
          const isPasswordValid = await comparePassword(password, user.hash);
          if (!isPasswordValid) {
            throw new Error("Invalid email or password");
          }
          // Password is valid, return user
          return {
            id: user.id,
            email: user.email,
            role: user.role,
          };
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

        }
        return null;
      },
    }),
    /**
     * ...add more providers here.
     *
     * Most other providers require a bit more work than the Discord provider. For example, the
     * GitHub provider requires you to add the `refresh_token_expires_in` field to the Account
     * model. Refer to the NextAuth.js docs for the provider you want to use. Example:
     *
     * @see https://next-auth.js.org/providers/github
     */
  ],
};

/**
 * Wrapper for `getServerSession` so that you don't need to import the `authOptions` in every file.
 *
 * @see https://next-auth.js.org/configuration/nextjs
 */
export const getServerAuthSession = () => getServerSession(authOptions);
