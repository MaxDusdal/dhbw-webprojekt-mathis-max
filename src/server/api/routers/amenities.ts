import { amenityCreateSchema } from "~/app/utils/zod";
import { adminProcedure, createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";

export const amenitiesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.amenity.findMany();
  }),

  create: protectedProcedure
    .input(amenityCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.create({
        data: input,
      });
    }),

  createBatch: protectedProcedure
    .input(z.array(amenityCreateSchema))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.createMany({
        data: input,
      });
    }),
});
