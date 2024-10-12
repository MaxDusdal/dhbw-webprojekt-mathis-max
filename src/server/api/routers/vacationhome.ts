import {
  vacationhomeCreateSchema,
  vacationhomeUpdateSchema,
} from "~/app/utils/zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
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
          images: {
            create: input.images?.map((image) => ({ url: image })),
          },
        },
      });

      return vacationhome;
    }),

  update: protectedProcedure
    .input(vacationhomeUpdateSchema)
    .mutation(async ({ input, ctx }) => {
      const { id, amenities, images, ...updateData } = input;

      const existingVacationHome = await ctx.db.vacationHome.findFirst({
        where: {
          id: id,
          ownerId: ctx.session.user.id,
        },
      });

      if (!existingVacationHome) {
        throw new Error(
          "Ferienhaus nicht gefunden oder Sie haben keine Berechtigung zum Bearbeiten",
        );
      }

      let amenitiesUpdate = {};
      if (amenities) {
        const amenityObjects = await ctx.db.amenity.findMany({
          where: { id: { in: amenities } },
        });
        amenitiesUpdate = {
          amenities: {
            set: [],
            connect: amenityObjects.map((amenity) => ({ id: amenity.id })),
          },
        };
      }

      let imagesUpdate = {};
      if (images) {
        imagesUpdate = {
          images: {
            deleteMany: {},
            create: images.map((image) => ({ url: image })),
          },
        };
      }

      const updatedVacationHome = await ctx.db.vacationHome.update({
        where: { id: id },
        data: {
          ...updateData,
          ...amenitiesUpdate,
          ...imagesUpdate,
        },
      });

      return updatedVacationHome;
    }),

  searchByLocation: publicProcedure
    .input(
      z.object({
        latitude: z.number(),
        longitude: z.number(),
        radiusInKm: z.number().positive(),
      }),
    )
    .query(async ({ ctx, input }) => {
      const { latitude, longitude, radiusInKm } = input;

      const vacationHomes: any[] = await ctx.db.$queryRaw`
        SELECT 
          id,
          title,
          "guestCount",
          "bedroomCount",
          "bedCount",
          "bathroomCount",
          "pricePerNight",
          description,
          "ownerId",
          "isAvailable",
          ST_X(location::geometry) as longitude,
          ST_Y(location::geometry) as latitude,
          ST_AsText(location) as location,
          ST_Distance(
            location::geography,
            ST_SetSRID(ST_MakePoint(${longitude}, ${latitude})::geometry, 4326)::geography
          ) as distance
        FROM "VacationHome"
        WHERE ST_DWithin(
          location::geography,
          ST_SetSRID(ST_MakePoint(${longitude}, ${latitude})::geometry, 4326)::geography,
          ${radiusInKm * 1000}
        )
        ORDER BY distance
      `;

      return vacationHomes.map((home: any) => ({
        ...home,
        geoLocation: {
          longitude: parseFloat(home.longitude),
          latitude: parseFloat(home.latitude),
        },
        distance: parseFloat(home.distance),
      }));
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

  findMany: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      const vacationHomes = await ctx.db.vacationHome.findMany({
        take: input.limit + 1, // Take one extra to check if there's a next page
        skip: input.cursor ? 1 : 0,
        cursor: input.cursor ? { id: input.cursor } : undefined,
        include: { images: true },
      });

      const hasNextPage = vacationHomes.length > input.limit;
      const items = hasNextPage ? vacationHomes.slice(0, -1) : vacationHomes;
      const lastVacationHome = items[items.length - 1];

      return {
        vacationHomes: items,
        nextCursor: lastVacationHome ? lastVacationHome.id : undefined,
        hasNextPage,
      };
    }),

  getVacationHomesByUser: protectedProcedure.query(async ({ ctx }) => {
    const vacationHomes = await ctx.db.vacationHome.findMany({
      where: {
        ownerId: ctx.session.user.id,
      },
      include: {
        images: true,
        bookings: {
          include: {
            user: true,
          },
        },
      },
    });
    return vacationHomes;
  }),

  getById: publicProcedure
    .input(z.object({ id: z.number() }))
    .query(async ({ input, ctx }) => {
      const vacationHome = await ctx.db.vacationHome.findUnique({
        where: { id: input.id },
        include: { images: true, amenities: true },
      });
      return vacationHome;
    }),
});
