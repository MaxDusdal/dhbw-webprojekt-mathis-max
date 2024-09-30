import { createTRPCRouter, publicProcedure, protectedProcedure, sessionPassProcedure } from "../trpc";
import { userCreateSchema } from "@/utils/zod";
import { saltAndHashPassword } from "@/utils/passwordHelper";
import { TRPCError } from "@trpc/server";
import { User } from "@prisma/client";
import { z } from "zod";
import { omit } from 'lodash';


async function getUser(id: string, ctx: any) {
  const user = await ctx.db.user.findUnique({
    where: { id },
    select: {
      id: true,
      username: true,
      email: true,
      role: true,
    },
  });

  return user;
}

export const usersRouter = createTRPCRouter({
  create: protectedProcedure
    .input(userCreateSchema)
    .mutation(async ({ input, ctx }) => {
      /*
      TODO: Du schwanzlappen
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

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users: User[] = await ctx.db.user.findMany({});

    return users;
  }),
});
