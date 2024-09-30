import { amenityCreateSchema } from "~/app/utils/zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const amenitiesRouter = createTRPCRouter({
  getAll: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.amenity.findMany();
  }),

  create: publicProcedure
    .input(amenityCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.create({
        data: input,
      });
    }),

  createBatch: publicProcedure
    .input(z.array(amenityCreateSchema))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.createMany({
        data: input,
      });
    }),
});
