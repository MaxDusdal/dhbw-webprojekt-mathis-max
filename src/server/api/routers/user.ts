import { createTRPCRouter, publicProcedure, protectedProcedure } from "../trpc";
import { userCreateSchema } from "@/utils/zod";
import { saltAndHashPassword } from "@/utils/passwordHelper";
import { TRPCError } from "@trpc/server";
import { User } from "@prisma/client";

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
      if ((await getUser(ctx.session.user.id, ctx)).role !== "ADMIN") {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to create a user.",
        });
      }

      const { salt, hash } = await saltAndHashPassword(input.password, 10);

      input.password = "";

      const newUser = await ctx.db.user.create({
        data: {
          ...input,
          hash,
          salt,
          role: "ADMIN",
        },
      });

      return newUser;
    }),

  getUsers: protectedProcedure.query(async ({ ctx }) => {
    const users: User[] = await ctx.db.user.findMany({});

    return users;
  }),
});
