import { Booking, User, VacationHome } from "@prisma/client";

import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import ReservationDataInput from "~/components/listings/ReservationDataInput";
import { Separator } from "~/components/ui/separator";
import { differenceInCalendarDays } from "date-fns";
import { round } from "lodash";
import {
  BookingWithVhAndImage,
  BookingWithVhAndImageAndAm,
} from "~/app/utils/types";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type CoverData = {
  image_url: string;
  title: string;
  description: string;
};
type ReservationData = {
  coverData: CoverData;
  dateRange: DateRange | undefined;
  guests: Guests;
  price_per_night: number;
};

type Props = {
  booking: BookingWithVhAndImage | BookingWithVhAndImageAndAm;
  bookingPage: boolean;
};

export default function BookingCard({ booking, bookingPage }: Props) {
  const dateRange: DateRange = {
    from: booking.checkInDate,
    to: booking.checkOutDate,
  };
  const guests = { adults: booking.guestCount, children: 0, pets: 0 };
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between space-x-4 pb-0 max-[425px]:space-x-2 max-[425px]:px-2">
        <div className="flex w-full max-w-[450px] flex-col">
          <CardTitle>
            {bookingPage ? booking.vacationHome.title : "Buchungsübersicht"}
          </CardTitle>
          <CardDescription className="h-10">{`Buchung von ${booking.user.firstName} ${booking.user.lastName}`}</CardDescription>
          <ReservationDataInput
            maxGuests={booking.vacationHome.guestCount}
            dateRange={dateRange}
            guests={guests}
          ></ReservationDataInput>
        </div>
        <div className="flex w-fit flex-col items-end justify-end space-x-2 max-[325px]:justify-start">
          <div className="flex h-fit max-h-[195px] w-fit max-w-[195px] flex-shrink-0 overflow-hidden rounded-lg max-[597px]:h-[110px] max-[597px]:w-[110px] xl:h-[195px] xl:w-[195px]">
            <Image
              className="h-fit w-fit"
              src={booking.vacationHome.images[0]?.url as string}
              alt="cover"
              width={195}
              height={195}
            ></Image>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-[425px]:px-2">
        <div className="mt-5 flex w-full flex-col space-y-4">
          <Separator></Separator>
          <div className="flex w-full justify-between">
            <p className="w-full font-medium">Dauer</p>
            <p className="w-fit text-nowrap font-medium">
              {differenceInCalendarDays(
                booking.checkOutDate,
                booking.checkInDate,
              ) + " Tage"}
            </p>
          </div>
          <Separator></Separator>
          <div className="flex w-full justify-between">
            <p className="w-full font-medium">Gesamtbetrag</p>
            <p className="w-fit text-nowrap font-medium">
              {booking.price + "€"}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
