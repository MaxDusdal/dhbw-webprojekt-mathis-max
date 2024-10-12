"use client";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { CalendarLarge } from "~/components/ui/calendar";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import ReservationCard from "./ReservationCard";
import MapComponent from "./MapComponent";
import ImageDisplay, { ImageDisplaySkeleton } from "./ImageDisplay";
import { differenceInCalendarDays } from "date-fns";
import { useRouter } from "next/navigation";
import {
  useReservation,
  verifyAmountParam,
  verifyDateParamWithDefault,
} from "~/hooks/useReservation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import StickyBookMobile from "./book/StickyBookMobile";
import {
  BookingWithVhAndImage,
  BookingWithVhAndImageAndAm,
  VacationHomeWithImages,
} from "~/app/utils/types";
import BookingCard from "~/components/bookingCard";
import { Skeleton } from "~/components/ui/skeleton";

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id || isNaN(Number(id))) {
    return "Kein Listing Kefunden";
  }
  const router = useRouter();
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });

  const bookingQuery = api.booking.getBookingsForVacationHome.useQuery({
    vacationHomeId: Number(id),
  });

  const bookingData: BookingWithVhAndImageAndAm[] | undefined =
    bookingQuery.data?.bookings.map((booking) => {
      if (!listing.data) {
        throw new Error("Vacation home data not available");
      }
      return {
        ...booking,
        user: booking.user, // Assuming the booking already includes the user
        vacationHome: {
          ...listing.data,
          images: listing.data.images,
          amenities: listing.data.amenities,
        },
      };
    });
  console.log(bookingQuery.data);
  const searchParams = useSearchParams();
  const sAdults = verifyAmountParam(searchParams.get("adults"), 1, 5, 1);
  const sChildren = verifyAmountParam(searchParams.get("children"), 0, 5, 0);
  const sPets = verifyAmountParam(searchParams.get("pets"), 0, 5, 0);
  const initialDateRange = verifyDateParamWithDefault(
    searchParams.get("from"),
    searchParams.get("to"),
  );

  const {
    dateRange,
    setDateRange,
    guests,
    handleSelectCheckIn,
    handleSelectCheckOut,
    handleChange,
    getUpdatedParams,
  } = useReservation(initialDateRange, sAdults, sChildren, sPets);

  // TODO: Hier eine "schönen Loading-State
  if (listing.isLoading) {
    return (
      <div>
        <RoomDetailSkeleton></RoomDetailSkeleton>
      </div>
    );
  }
  // TODO: Hier eine "schöne" Fehlermeldung
  if (!listing.data) {
    return "Kein Listing gefunden";
  }

  const bedBathSummary = `${listing.data.guestCount} ${listing.data.guestCount > 1 ? "Gäste" : "Gast"}
  - ${listing.data.bedCount} ${listing.data.bedCount > 1 ? "Betten" : "Bett"}
       - ${listing.data.bedroomCount} Schlafzimmer 
        - ${listing.data.bathroomCount} ${listing.data.bathroomCount > 1 ? "Bäder" : "Bad"}`;

  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col px-4">
        <h1 className="text-2xl font-medium">{listing.data?.title}</h1>
        <ImageDisplay image_urls={listing.data?.images}></ImageDisplay>
        <div className="flex w-full flex-col xl:flex-row">
          <div className="flex flex-col space-y-10 py-8 xl:pr-8">
            <div className="mb-4">
              <h1 className="text-2xl font-medium">
                {listing.data.locationDescription}
              </h1>
              <p className="font-light">{bedBathSummary}</p>
            </div>
            <Separator></Separator>
            <div className="flex flex-col space-y-8">
              <h2 className="text-2xl font-medium">Über diese Unterkunft</h2>
              <p>{listing.data.description}</p>
            </div>
            <Separator></Separator>
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-medium">
                Das Bietet diese Unterkunft
              </h2>
              {listing.data?.amenities ? (
                <div className="mt-3 grid w-full grid-cols-2 gap-5 sm:grid-cols-3 md:grid-cols-4">
                  {listing.data.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className={
                        "flex flex-col items-start gap-2 rounded-md p-4 ring-1 ring-gray-300"
                      }
                    >
                      <Image
                        src={"/images/" + amenity.icon}
                        alt={amenity.name}
                        width={26}
                        height={26}
                      />
                      <div>
                        <div>{amenity.name}</div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <></>
              )}
            </div>

            <Separator></Separator>

            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-medium">
                {dateRange?.from
                  ? dateRange.to
                    ? differenceInCalendarDays(dateRange.to, dateRange.from) +
                      (differenceInCalendarDays(dateRange.to, dateRange.from) >
                      1
                        ? " Nächte "
                        : " Nacht ") +
                      listing.data?.locationDescription
                    : "Check-Out Datum wählen"
                  : "Chek-In Datum wählen"}
              </h2>
              <CalendarLarge
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                disabled={(date) => {
                  const today = new Date();
                  return dateRange?.to
                    ? false
                    : dateRange?.from
                      ? date <= dateRange.from
                      : date <
                        new Date(
                          today.getFullYear(),
                          today.getMonth(),
                          today.getDate(),
                        );
                }}
                numberOfMonths={2}
              />
            </div>

            <Separator></Separator>

            <div className="mt-10 flex flex-col space-y-4">
              <h2 className="text-2xl font-medium">Hier wirst du sein</h2>
              {listing.data?.latitude && listing.data.longitude ? (
                <MapComponent
                  longitude={listing.data?.longitude}
                  latitude={listing.data?.latitude}
                ></MapComponent>
              ) : (
                <></>
              )}
            </div>
          </div>

          <div className="relative order-first mx-auto hidden justify-end py-8 xl:order-last xl:flex xl:w-[379px] xl:pl-10">
            <ReservationCard
              maxGuests={listing.data.guestCount}
              price_per_night={listing.data?.pricePerNight as number}
              listing_id={listing.data?.id as number}
              dateRange={dateRange}
              handleSelectCheckIn={handleSelectCheckIn}
              handleSelectCheckOut={handleSelectCheckOut}
              guests={guests}
              handleChange={handleChange}
              getUpdatedParams={getUpdatedParams}
            ></ReservationCard>
          </div>
        </div>

        <Separator></Separator>
        {bookingData && (
          <div className="flex flex-col space-y-10">
            <h2 className="mt-10 text-2xl font-medium" id="bookings">
              {bookingQuery.data?.isOwner
                ? "Offene Buchungen für dieses Inserat (Du bist der Besitzer)"
                : "Deine Buchungen"}
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
          </div>
        )}
      </div>
      <StickyBookMobile
        dateRange={dateRange}
        vacationHome={listing.data as VacationHomeWithImages}
        getUpdatedParams={getUpdatedParams}
      ></StickyBookMobile>
    </div>
  );
}

const RoomDetailSkeleton = () => {
  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col px-4">
        <Skeleton className="mb-4 h-8 w-[300px]" />
        <ImageDisplaySkeleton></ImageDisplaySkeleton>
        <div className="flex w-full flex-col xl:flex-row">
          <div className="flex flex-grow flex-col space-y-10 py-8 xl:pr-8">
            <div className="mb-4">
              <Skeleton className="mb-2 h-6 w-1/2" />
              <Skeleton className="h-4 w-1/3" />
            </div>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Skeleton className="mb-2 h-6 w-1/4" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-3/4" />
            </div>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Skeleton className="mb-2 h-6 w-1/3" />
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
                {[...Array(8)].map((_, index) => (
                  <Skeleton key={index} className="h-20 w-full rounded-md" />
                ))}
              </div>
            </div>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Skeleton className="mb-2 h-6 w-1/2" />
              <Skeleton className="h-64 w-full" />
            </div>
            <Separator />
            <div className="flex flex-col space-y-4">
              <Skeleton className="mb-2 h-6 w-1/3" />
              <Skeleton className="h-96 w-full" />
            </div>
          </div>
          <div className="relative hidden xl:flex xl:w-[379px] xl:pl-10">
            <Skeleton className="sticky top-20 h-96 w-full rounded-xl" />
          </div>
        </div>
      </div>
      <div className="fixed bottom-0 left-0 right-0 xl:hidden">
        <Skeleton className="h-16 w-full" />
      </div>
    </div>
  );
};
