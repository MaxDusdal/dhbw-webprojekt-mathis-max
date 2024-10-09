import {
  createTRPCRouter,
  publicProcedure,
  protectedProcedure,
  sessionPassProcedure,
  adminProcedure,
} from "../trpc";
import {
  changePasswordSchema,
  userCreateSchema,
  userProfileSchema,
} from "@/utils/zod";
import { comparePassword, saltAndHashPassword } from "@/utils/passwordHelper";
import { TRPCError } from "@trpc/server";
import { Role, type User } from "@prisma/client";
import { z } from "zod";
import { omit } from "lodash";
import type { UserWithoutSensitiveInfo, UserWithSessions } from "~/app/utils/types";

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

  delete: protectedProcedure
    // TODO: CASCADE DELETION
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.delete({
        where: { id: input.id },
      });
    }),

  getUsers: adminProcedure.query(async ({ ctx }) => {
    const users: User[] = await ctx.db.user.findMany({
      include: {
        sessions: {
          orderBy: {
            createdAt: "desc",
          },
        },
      },
    });

    return users as UserWithSessions[];
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

  updateUser: protectedProcedure
    .input(userProfileSchema)
    .mutation(async ({ input, ctx }) => {
      const currentUser = await ctx.db.user.findUnique({
        where: { id: ctx.session.user.id },
      });

      if (!currentUser) {
        throw new TRPCError({
          code: "INTERNAL_SERVER_ERROR",
          message: "User not found",
        });
      }

      const emailUniqueConstraint = await ctx.db.user.findFirst({
        where: {
          email: input.email,
          id: { not: currentUser.id },
        },
      });

      if (emailUniqueConstraint) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Die Mail ist bereits vergeben",
        });
      }

      await ctx.db.user.update({
        where: { id: ctx.session.user.id },
        data: input,
      });
    }),

  changeRole: adminProcedure
    .input(z.object({ id: z.string(), role: z.nativeEnum(Role) }))
    .mutation(async ({ input, ctx }) => {
      await ctx.db.user.update({
        where: { id: input.id },
        data: { role: input.role },
      });
      return true;
    }),
});
