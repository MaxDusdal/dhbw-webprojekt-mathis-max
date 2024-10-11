"use client";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { CalendarLarge } from "~/components/ui/calendar";
import React from "react";
import { useParams, useSearchParams } from "next/navigation";
import ReservationCard from "./ReservationCard";
import MapComponent from "./MapComponent";
import ImageDisplay from "./ImageDisplay";
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
import BookingCard from "~/components/bookingCard";

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
  } = useReservation(initialDateRange, sAdults, sChildren, sPets);

  // TODO: Hier eine "schönen Loading-State
  if (listing.isLoading) {
    return <div>Loading...</div>;
  }
  // TODO: Hier eine "schöne" Fehlermeldung
  if (!listing.data) {
    return "Kein Listing gefunden";
  }
  type CoverData = {
    image_url: string;
    title: string;
    description: string;
  };

  const coverData: CoverData = {
    image_url: listing.data?.images[0]?.url || "https://picsum.photos/200",
    title: listing.data?.title || "Unterkunft",
    description: "Unterkuft: Wohnung",
  };
  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col p-10">
        <h1 className="text-2xl font-medium">{listing.data?.title}</h1>
        <ImageDisplay image_urls={listing.data?.images}></ImageDisplay>
        <div className="flex w-full flex-row">
          <div className="flex w-2/3 flex-col space-y-10 py-8 pr-8">
            <div className="mb-4">
              <h1 className="text-2xl font-medium">Hier steht noch ein Text</h1>
              <p className="font-light">Hier steht die anzahl Betten etc</p>
            </div>
            <Separator></Separator>
            <div className="flex flex-col space-y-8">
              <h2 className="text-2xl font-medium">Über diese Unterkunft</h2>
              <p>
                Ein wunderbares seltenes Haus, das von der Künstlerin Gernod
                Minke in der Nähe der Innenstadt von Kassel gebaut wurde. Es ist
                ein schöner gemütlicher Ort. Wir empfehlen es auch für Familien
                zum Entspannen und Beruhigen in dieser schönen Stadt und der
                Weltsage-Parks. Hunde sind herzlich willkommen und der Wald ist
                in der Nähe. Im schönen Garten hast du einen Schwimmteich und
                eine Terrasse, um zum Beispiel zu sitzen und zu frühstücken. Wir
                freuen uns, dich zu sehen...
              </p>
            </div>
            <Separator></Separator>
            <div className="flex flex-col space-y-4">
              <h2 className="text-2xl font-medium">
                Das Bietet diese Unterkunft
              </h2>
              {listing.data?.amenities ? (
                <div className="mt-3 grid w-full grid-cols-4 gap-5">
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

          <div className="relative flex w-[379px] justify-end py-8 pl-10">
            <ReservationCard
              price_per_night={listing.data?.pricePerNight as number}
              listing_id={listing.data?.id as number}
              dateRange={dateRange}
              handleSelectCheckIn={handleSelectCheckIn}
              handleSelectCheckOut={handleSelectCheckOut}
              guests={guests}
              handleChange={handleChange}
            ></ReservationCard>
          </div>
        </div>

        <Separator></Separator>
        <div className="flex flex-col space-y-10">
          <h2 className="mt-10 text-2xl font-medium">
            {bookingQuery.data?.isOwner
              ? " Buchungen für dieses Inserat (Du bist der Besitzer)"
              : "Deine Buchungen"}
          </h2>
          {bookingQuery.data?.isOwner
            ? bookingQuery.data?.bookings?.map((booking) => (
                <div key={booking.id}>{booking.id}</div>
              ))
            : null}
          <div className="xl:grid xl:grid-cols-2 xl:gap-4">
            {bookingQuery.data?.bookings?.map((booking) => (
              <BookingCard
                booking={booking}
                coverData={coverData}
              ></BookingCard>
              /*<Card key={booking.id}>
            <CardHeader>
              <CardTitle>
                Buchung von {booking.user.firstName} {booking.user.lastName} für{" "}
                {booking.guestCount} Personen
              </CardTitle>
              <CardDescription>{listing.data?.title}</CardDescription>
            </CardHeader>
          </Card>*/
            ))}
          </div>
          <Separator></Separator>
        </div>
      </div>
    </div>
  );
}
