"use client";
import { api } from "~/trpc/react";
import { useParams } from "next/navigation";
import { BookingWithVhAndImageAndAm } from "~/app/utils/types";
import { Separator } from "~/components/ui/separator";
import BookingCard from "~/components/bookingCard";
import { startOfMonth, endOfMonth, isWithinInterval, setMonth } from "date-fns";

import Dashboard from "./dashboard";
import { DashboardSkeleton } from "./dashboardSkeleton";

interface MonthlyEarningsResult {
  monthlyEarnings: number[];
  bestMonth: number;
}

export default function DashboardPage() {
  const { id } = useParams<{ id: string }>();
  if (!id || isNaN(Number(id))) {
    return "Kein Listing Kefunden";
  }
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });

  const bookingQuery = api.booking.getBookingsForVacationHome.useQuery({
    vacationHomeId: Number(id),
  });

  if (listing.isLoading || bookingQuery.isLoading) {
    return <DashboardSkeleton></DashboardSkeleton>;
  }

  const bookingData: BookingWithVhAndImageAndAm[] | undefined =
    bookingQuery.data?.bookings.map((booking) => {
      if (!listing.data) {
        throw new Error("Vacation home data not available");
      }
      return {
        ...booking,
        user: booking.user,
        vacationHome: {
          ...listing.data,
          images: listing.data.images,
          amenities: listing.data.amenities,
        },
      };
    });

  const transformBookingData = () => {
    const bookings = bookingQuery.data?.bookings || [];

    return bookings.map((booking) => ({
      id: booking.id,
      user: {
        name: `${booking.user.firstName} ${booking.user.lastName}`,
        email: booking.user.email,
      },
      price: booking.price,
      createdAt: booking.createdAt.toISOString(),
    }));
  };
  function calculateTotalEarnings(): number {
    const bookings = bookingQuery.data?.bookings || [];
    return bookings.reduce((total, booking) => total + booking.price, 0);
  }

  function calculateMonthEarnings(month: number): number {
    const bookings = bookingQuery.data?.bookings || [];
    if (month < 1 || month > 12) {
      return -1;
    }

    const currentYear = new Date().getFullYear();
    const targetMonth = setMonth(new Date(currentYear, 0), month - 1);
    const monthStart = startOfMonth(targetMonth);
    const monthEnd = endOfMonth(targetMonth);

    return bookings.reduce((total, booking) => {
      if (
        isWithinInterval(booking.createdAt, {
          start: monthStart,
          end: monthEnd,
        })
      ) {
        return total + booking.price;
      }
      return total;
    }, 0);
  }

  function calculateOpenBookings() {
    const bookings = bookingQuery.data?.bookings || [];
    return bookings.filter((booking) => booking.status === "PAID").length;
  }

  function calculateAllMonthlyEarnings(): MonthlyEarningsResult {
    const monthlyEarnings = Array(12)
      .fill(0)
      .map((_, index) => calculateMonthEarnings(index + 1));

    const bestMonth = Math.max(...monthlyEarnings);

    return { monthlyEarnings, bestMonth };
  }

  function compareMonthlyEarnings(
    currentEarnings: number,
    previousEarnings: number,
  ): string {
    if (previousEarnings === 0) {
      return currentEarnings > 0
        ? `+${currentEarnings}€ mehr als im letzten Monat`
        : "0% Änderung zum letzten Monat";
    }

    const percentageChange =
      ((currentEarnings - previousEarnings) / previousEarnings) * 100;
    const roundedPercentage = Math.abs(
      Math.round(percentageChange * 100) / 100,
    ); // Runden auf 2 Dezimalstellen

    if (percentageChange > 0) {
      return `+${roundedPercentage}% mehr als letzter Monat`;
    } else if (percentageChange < 0) {
      return `-${roundedPercentage}% weniger als letzter Monat`;
    } else {
      return "0% Änderung zum letzten Monat";
    }
  }
  function getNewBookingsForCurrentMonth(): number {
    const bookings = bookingQuery.data?.bookings || [];
    const now = new Date();
    const currentMonthStart = startOfMonth(now);
    const currentMonthEnd = endOfMonth(now);

    return bookings.filter((booking) =>
      isWithinInterval(booking.createdAt, {
        start: currentMonthStart,
        end: currentMonthEnd,
      }),
    ).length;
  }
  const totalEarnings = calculateTotalEarnings();
  const currentMonthEarnings = calculateMonthEarnings(
    new Date().getMonth() + 1,
  );
  const previousMonthEarnings = calculateMonthEarnings(new Date().getMonth());
  const monthEarningsComparison = compareMonthlyEarnings(
    currentMonthEarnings,
    previousMonthEarnings,
  );
  const totalBookings = bookingQuery.data?.bookings
    ? bookingQuery.data.bookings.length
    : 0;
  const openBookings = calculateOpenBookings();
  const newMonthlyBookings = getNewBookingsForCurrentMonth();
  const overview = calculateAllMonthlyEarnings();
  const recentBookings = transformBookingData();

  const data = {
    totalEarnings,
    currentMonthEarnings,
    previousMonthEarnings,
    monthEarningsComparison,
    totalBookings,
    openBookings,
    newMonthlyBookings,
    overview,
    recentBookings,
  };

  return (
    <div className="flex flex-col space-y-10">
      <Dashboard data={data}></Dashboard>

      <Separator></Separator>
      {bookingData && (
        <>
          <h2 className="mt-10 text-2xl font-medium" id="bookings">
            Offene Buchungen für dieses Inserat
          </h2>
          <div className="grid gap-4 xl:grid-cols-2">
            {bookingData.map(
              (booking) =>
                booking.status === "PAID" && (
                  <BookingCard
                    booking={booking}
                    bookingPage={false}
                  ></BookingCard>
                ),
            )}
          </div>
          <Separator></Separator>
        </>
      )}
    </div>
  );
}
