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

  getBookingsForVacationHome: protectedProcedure
    .input(z.object({ vacationHomeId: z.number() }))
    .query(async ({ input, ctx }) => {
      const vacationHome = await ctx.db.vacationHome.findUnique({
        where: { id: input.vacationHomeId },
        include: { owner: true, bookings: true },
      });

      if (ctx.session.user.id !== vacationHome?.ownerId) {
        throw new TRPCError({
          code: "FORBIDDEN",
          message:
            "Du kannst nur die Buchungen deiner eigenen Ferienhäuser ansehen",
        });
      }

      return vacationHome?.bookings;
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
            booking.status === "CONFIRMED",
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
          status: "PENDING",
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

      if (booking?.status === "CONFIRMED") {
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
        data: { status: "CONFIRMED" },
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

      if (booking?.status !== "CONFIRMED") {
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
});
