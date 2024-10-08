import { z } from "node_modules/zod/lib";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { passwordSchema } from "~/app/utils/zod";
import { TRPCError } from "@trpc/server";
import { comparePassword } from "~/app/utils/passwordHelper";

export const sessionRouter = createTRPCRouter({
  getSessions: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.session.findMany({
      where: {
        userId: ctx.session.user.id,
      },
      orderBy: {
        createdAt: "desc",
      },
    });
  }),

  closeSession: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ ctx, input }) => {
      return ctx.db.session.delete({
        where: {
          id: input.id,
          userId: ctx.session.user.id,
        },
      });
    }),

  closeAllSessions: protectedProcedure
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
      await ctx.db.session.deleteMany({
        where: {
          userId: ctx.session.user.id,
          id: { not: ctx.session.session.id },
        },
      });
      return true;
    }),
});
