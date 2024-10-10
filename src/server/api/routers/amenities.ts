import { amenityCreateSchema } from "~/app/utils/zod";
import { adminProcedure, createTRPCRouter, publicProcedure } from "../trpc";
import { z } from "zod";

export const amenitiesRouter = createTRPCRouter({
  getAll: publicProcedure.query(async ({ ctx }) => {
    return ctx.db.amenity.findMany();
  }),

  create: adminProcedure
    .input(amenityCreateSchema)
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.create({
        data: input,
      });
    }),

  createBatch: adminProcedure
    .input(z.array(amenityCreateSchema))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.amenity.createMany({
        data: input,
      });
    }),
});
