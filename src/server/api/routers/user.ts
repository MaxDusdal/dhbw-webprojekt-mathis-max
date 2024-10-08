import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  sessionPassProcedure,
} from "../trpc";
import {
  changePasswordSchema,
  passwordSchema,
  signUpSchema,
  userCreateSchema,
} from "@/utils/zod";
import { comparePassword, saltAndHashPassword } from "@/utils/passwordHelper";
import { TRPCError } from "@trpc/server";
import type { User } from "@prisma/client";
import { z } from "zod";
import { omit } from "lodash";
import type { UserWithoutSensitiveInfo } from "~/app/utils/types";

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(userCreateSchema)
    .mutation(async ({ input, ctx }) => {
      /*
      if ((await getUser(ctx.session.user.id, ctx)).role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a user.",
        });
      }
        */

      const { salt, hash } = await saltAndHashPassword(input.password, 10);

      // remove password key from input
      const cleanedInput = omit(input, "password");

      const newUser = await ctx.db.user.create({
        data: {
          ...cleanedInput,
          hash,
          salt,
        },
      });

      return newUser;
    }),

  signUp: publicProcedure
    .input(signUpSchema)
    .mutation(async ({ input, ctx }) => {
      const { salt, hash } = await saltAndHashPassword(input.password, 10);

      const newUser = await ctx.db.user.create({
        data: {
          firstName: input.firstName,
          lastName: input.lastName,
          email: input.email,
          role: "USER",
          hash,
          salt,
          avatar: "",
        },
      });

      if (!newUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not created",
        });
      }

      const session = await ctx.lucia.createSession(newUser.id, {});
      const sessionCookie = ctx.lucia.createSessionCookie(session.id);
      return { newUser, sessionCookie };
    }),

  delete: protectedProcedure
    // TODO: CASCADE DELETION
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users: User[] = await ctx.db.user.findMany({});

    return users;
  }),

  getByEmail: protectedProcedure
    .input(z.object({ email: z.string().optional() }))
    .query(async ({ input, ctx }) => {
      if (!input?.email) return null;
      const user = await ctx.db.user.findUnique({
        where: { email: input.email },
      });
      return user;
    }),

  getCallerUser: protectedProcedure.query(async ({ ctx }) => {
    const user = await ctx.db.user.findUnique({
      where: { id: ctx.session.user.id, email: ctx.session.user.email },
      select: {
        id: true,
        email: true,
        role: true,
        avatar: true,
        firstName: true,
        lastName: true,
        nationality: true,
        phoneNumber: true,
        preferredLanguage: true,
        hash: false,
        salt: false,
      },
    });
    return user as UserWithoutSensitiveInfo;
  }),

  changePassword: protectedProcedure
    .input(changePasswordSchema)
    .mutation(async ({ input, ctx }) => {
      const { currentPassword, newPassword } = input;
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const validPassword = await comparePassword(currentPassword, user.hash);

      if (!validPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aktuelles Passwort ist falsch",
        });
      }

      const { salt, hash } = await saltAndHashPassword(newPassword, 10);
      try {
        await ctx.db.user.update({
          where: { id: ctx.session.user.id },
          data: { hash, salt },
        });
      } catch (error) {
        console.error(error);
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "Passwort konnte nicht geändert werden",
        });
      }

      return true;
    }),

  deleteUser: sessionPassProcedure.mutation(async ({ ctx }) => {
    // TODO: Check if deletion is cascading to VacationHomes also, invalidate all tokens
    await ctx.db.user.delete({
      where: { id: ctx.session.user.id },
    });
    return true;
  }),

  deleteAllSessions: sessionPassProcedure
    .input(passwordSchema)
    .mutation(async ({ input, ctx }) => {
      const { password } = input;
      const user = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!user) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const validPassword = await comparePassword(password, user.hash);

      if (!validPassword) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Aktuelles Passwort ist falsch",
        });
      }
      // Delete all sessions except the current one, to invalidate all tokens
      // May is a bit of a hack, by using the session.expires field, which is a datetime.
      // But realistically, the user won't have 2 sessions open at the same time, so this is a good enough solution
      const currentSession = ctx.session.session.expiresAt;
      await ctx.db.session.deleteMany({
        where: {
          userId: ctx.session.user.id,
          expiresAt: { not: currentSession },
        },
      });
      return true;
    }),
});
