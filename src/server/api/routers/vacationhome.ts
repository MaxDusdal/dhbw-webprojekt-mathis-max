import { vacationhomeCreateSchema } from "~/app/utils/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";

export const vacationhomeRouter = createTRPCRouter({
  create: protectedProcedure
    .input(vacationhomeCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const amenities = await ctx.db.amenity.findMany({
        where: {
          id: {
            in: input.amenities,
          },
        },
      });

      const vacationhome = await ctx.db.vacationHome.create({
        data: {
          ...input,
          amenities: {
            connect: amenities.map((amenity) => ({ id: amenity.id })),
          },
          owner: {
            connect: {
              id: ctx.session.user.id,
            },
          },
        },
      });

      return vacationhome;
    }),

  delete: protectedProcedure
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input, ctx }) => {
      const ownerOfVacationHome = await ctx.db.vacationHome.findUnique({
        where: {
          id: input.id,
        },
        select: {
          ownerId: true,
        },
      });

      if (
        ownerOfVacationHome?.ownerId !== ctx.session.user.id &&
        ctx.session.user.role !== "ADMIN"
      ) {
        throw new TRPCError({
          code: "UNAUTHORIZED",
          message: "You are not authorized to delete this vacation home.",
        });
      }

      await ctx.db.vacationHome.delete({
        where: {
          id: input.id,
        },
      });
    }),
});
