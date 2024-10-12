"use client";
import BookingCard from "~/components/bookingCard";
import { api } from "~/trpc/react";

export default function Bookings() {
  const getCallerUser = api.user.getCallerUser.useQuery();
  const bookings = api.booking.getBookingsForUserId.useQuery({
    userId: getCallerUser.data?.id as string,
  });
  return (
    <div className="mt-5 grid gap-5 xl:grid-cols-2">
      {bookings.data?.bookings.map((booking) => (
        <BookingCard booking={booking} bookingPage={true}></BookingCard>
      ))}
    </div>
  );
}
