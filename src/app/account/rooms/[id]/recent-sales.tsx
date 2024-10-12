import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "~/components/ui/avatar";

interface recentBooking {
  id: string;
  user: {
    name: string;
    email: string;
  };
  price: number;
  createdAt: string;
}

function getRecentBookings(
  bookings: recentBooking[],
  limit: number = 5,
): recentBooking[] {
  return bookings.slice(0, limit);
}

interface RecentSalesProps {
  bookings: recentBooking[];
}

export function RecentSales({ bookings }: RecentSalesProps) {
  const recentBookings = getRecentBookings(bookings);

  return (
    <div className="space-y-8">
      {recentBookings.map((booking) => (
        <div key={booking.id} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarFallback>
              {booking.user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">
              {booking.user.name}
            </p>
            <p className="text-sm text-muted-foreground">
              {booking.user.email}
            </p>
          </div>
          <div className="ml-auto font-medium">
            +€{booking.price.toFixed(2)}
          </div>
        </div>
      ))}
    </div>
  );
}
