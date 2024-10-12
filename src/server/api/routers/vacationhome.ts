import {
  vacationhomeCreateSchema,
  vacationhomeUpdateSchema,
} from "~/app/utils/zod";
import { createTRPCRouter, protectedProcedure, publicProcedure } from "../trpc";
import { z } from "zod";
import { TRPCError } from "@trpc/server";
import { createCaller } from "../root";

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
              vh.id,
              vh.title,
              vh."guestCount",
              vh."bedroomCount",
              vh."bedCount",
              vh."bathroomCount",
              vh."pricePerNight",
              vh.description,
              vh."ownerId",
              vh."isAvailable",
              ST_X(vh.location::geometry) as longitude,
              ST_Y(vh.location::geometry) as latitude,
              ST_AsText(vh.location) as location,
              ST_Distance(
                vh.location::geography,
                ST_SetSRID(ST_MakePoint(${longitude}, ${latitude})::geometry, 4326)::geography
              ) as distance,
              json_agg(
                DISTINCT jsonb_build_object(
                  'id', b.id,
                  'checkInDate', b."checkInDate",
                  'checkOutDate', b."checkOutDate",
                  'userId', b."userId"
                )
              ) FILTER (WHERE b.id IS NOT NULL) as bookings,
              json_agg(
                DISTINCT jsonb_build_object(
                  'id', img.id,
                  'url', img.url
                )
              ) FILTER (WHERE img.id IS NOT NULL) as images
            FROM "VacationHome" vh
            LEFT JOIN "Booking" b ON vh.id = b."vacationHomeId"
            LEFT JOIN "Image" img ON vh.id = img."vacationHomeId"
            WHERE ST_DWithin(
              vh.location::geography,
              ST_SetSRID(ST_MakePoint(${longitude}, ${latitude})::geometry, 4326)::geography,
              ${radiusInKm * 1000}
            )
            GROUP BY vh.id
            ORDER BY distance
          `;

      return vacationHomes.map((home: any) => ({
        ...home,
        geoLocation: {
          longitude: parseFloat(home.longitude),
          latitude: parseFloat(home.latitude),
        },
        distance: parseFloat(home.distance),
        bookings: home.bookings || [],
        images: home.images || [],
      }));
    }),
    
  findMany: publicProcedure
    .input(
      z.object({
        limit: z.number(),
        cursor: z.number().optional(),
        coordinates: z
          .object({
            lat: z.number().optional(),
            lng: z.number().optional(),
          })
          .optional(),
        checkIn: z.string().optional(),
        checkOut: z.string().optional(),
        adults: z.number().optional(),
        children: z.number().optional(),
        pets: z.number().optional(),
      }),
    )
    .query(async ({ input, ctx }) => {
      let vacationHomes;

      if (input.coordinates && input.coordinates.lat && input.coordinates.lng) {
        const caller: any = createCaller(ctx);
        vacationHomes = await caller.vacationhome.searchByLocation({
          latitude: input.coordinates.lat,
          longitude: input.coordinates.lng,
          radiusInKm: 50,
        });
      } else {
        vacationHomes = await ctx.db.vacationHome.findMany({
          where: {
            isAvailable: true,
          },
          include: { images: true },
        });
      }

      // Apply filters
      vacationHomes = vacationHomes.filter((home: any) => {
        const guestCount = (input.adults || 0) + (input.children || 0);
        if (guestCount > 0 && home.guestCount < guestCount) {
          return false;
        }

        if (input.checkIn !== undefined && input.checkOut !== undefined) {
          const hasConflictingBooking = home.bookings?.some(
            (booking: any) =>
              // @ts-ignore
              booking.checkInDate <= input.checkOut &&
              // @ts-ignore
              booking.checkOutDate >= input.checkIn,
          );
          if (hasConflictingBooking) {
            return false;
          }
        }

        return true;
      });

      // Apply pagination
      const startIndex = input.cursor || 0;
      const endIndex = startIndex + input.limit;
      const items = vacationHomes.slice(startIndex, endIndex);
      
      const nextCursor = endIndex < vacationHomes.length ? endIndex : undefined;

      return {
        vacationHomes: items,
        nextCursor,
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
