import { bookingCreateSchema } from "~/app/utils/zod";
import { createTRPCRouter, protectedProcedure } from "../trpc";
import { TRPCError } from "@trpc/server";
import { differenceInDays } from "date-fns";
import { z } from "node_modules/zod/lib";

export const bookingRouter = createTRPCRouter({
  getBookings: protectedProcedure.query(async ({ ctx }) => {
    return ctx.db.booking.findMany({
      where: { userId: ctx.session.user.id },
      include: { vacationHome: true },
    });
  }),

  // This endpoint can return two separte types of bookings:
  // 1. If the VacationHome is owned by the calling user, it returns all bookings for that vacation home
  // 2. If the VacationHome is not owned by the calling user, it returns only the bookings that the calling user has made
  getBookingsForVacationHome: protectedProcedure
    .input(z.object({ vacationHomeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const vacationHome = await ctx.db.vacationHome.findUnique({
        where: { id: input.vacationHomeId },
        include: {
          owner: true,
          bookings: {
            include: {
              user: true,
            },
            orderBy: {
              createdAt: "desc",
            },
          },
        },
      });
      const booking = await ctx.db.booking.findMany({
        where: {
          vacationHomeId: input.vacationHomeId,
        },
        include: {
          vacationHome: true,
        },
      });

      if (ctx.session.user.id === vacationHome?.ownerId) {
        return {
          bookings: vacationHome?.bookings,
          isOwner: true,
        };
      }

      // The user can only see its own bookings for that vacation home
      if (
        vacationHome?.bookings.some(
          (booking) => booking.userId === ctx.session.user.id,
        )
      ) {
        return {
          bookings: vacationHome?.bookings.filter(
            (booking) => booking.userId === ctx.session.user.id,
          ),
          isOwner: false,
        };
      }

      return {
        bookings: [],
        isOwner: false,
      };
    }),

  getBookingsForUserId: protectedProcedure
    .input(z.object({ userId: z.string() }))
    .query(async ({ input, ctx }) => {
      const bookings = await ctx.db.booking.findMany({
        where: {
          userId: input.userId,
        },
        include: {
          user: true,
          vacationHome: {
            include: {
              images: true,
            },
          },
        },
      });

      return { bookings: bookings };
    }),

  create: protectedProcedure
    .input(bookingCreateSchema)
    .mutation(async ({ input, ctx }) => {
      const vacationHome = await ctx.db.vacationHome.findUnique({
        where: { id: input.vacationHomeId },
        include: { owner: true, bookings: true },
      });

      if (!vacationHome) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Ferienhaus nicht gefunden",
        });
      }

      if (vacationHome.owner.id === ctx.session.user.id) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Du kannst nicht eine Buchung für dein eigenes Ferienhaus machen",
        });
      }

      if (
        vacationHome.bookings.some(
          (booking) =>
            booking.checkInDate < input.checkOutDate &&
            booking.checkOutDate > input.checkInDate &&
            booking.status === "PAID",
        )
      ) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Ferienhaus ist schon gebucht",
        });
      }

      const booking = await ctx.db.booking.create({
        data: {
          ...input,
          price:
            vacationHome.pricePerNight *
            differenceInDays(input.checkOutDate, input.checkInDate),
          userId: ctx.session.user.id,
          vacationHomeId: input.vacationHomeId,
          status: "PAID",
        },
      });
      return booking;
    }),

  cancel: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: { vacationHome: true, user: true },
      });

      if (!booking) {
        throw new TRPCError({
          code: "NOT_FOUND",
          message: "Buchung nicht gefunden",
        });
      }

      if (
        booking?.user.id !== ctx.session.user.id &&
        ctx.session.user.id !== booking?.vacationHome.ownerId
      ) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message: "Du kannst nur deine eigenen Buchungen stornieren",
        });
      }

      if (booking.status === "CANCELLED" || booking.status === "COMPLETED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Buchung ist bereits abgeschlossen oder storniert",
        });
      }

      await ctx.db.booking.update({
        where: { id: input.id },
        data: { status: "CANCELLED" },
      });
    }),

  accept: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: { vacationHome: true },
      });

      if (ctx.session.user.id !== booking?.vacationHome.ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Du kannst nur die Buchungen deiner eigenen Ferienhäuser annehmen",
        });
      }

      if (booking?.status === "CANCELLED" || booking?.status === "COMPLETED") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Buchung ist bereits abgeschlossen oder storniert",
        });
      }

      if (booking?.status === "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Buchung ist bereits bestätigt",
        });
      }

      if (booking?.checkInDate < new Date()) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Buchung ist bereits abgeschlossen",
        });
      }

      await ctx.db.booking.update({
        where: { id: input.id },
        data: { status: "PAID" },
      });
    }),

  complete: protectedProcedure
    .input(z.object({ id: z.string() }))
    .mutation(async ({ input, ctx }) => {
      const booking = await ctx.db.booking.findUnique({
        where: { id: input.id },
        include: { vacationHome: true },
      });

      if (ctx.session.user.id !== booking?.vacationHome.ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Du kannst nur die Buchungen deiner eigenen Ferienhäuser abschließen",
        });
      }

      if (booking?.status !== "PAID") {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Buchung ist nicht bestätigt",
        });
      }

      await ctx.db.booking.update({
        where: { id: input.id },
        data: { status: "COMPLETED" },
      });
    }),

  getBlockedDates: protectedProcedure
    .input(z.object({ vacationHomeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const bookings = await ctx.db.booking.findMany({
        where: { vacationHomeId: input.vacationHomeId },
        select: {
          checkInDate: true,
          checkOutDate: true,
        },
      });
      const blockedDates: { from: Date; to: Date }[] = [];

      for (const booking of bookings) {
        blockedDates.push({
          from: booking.checkInDate,
          to: booking.checkOutDate,
        });
      }

      return blockedDates;
    }),
});
