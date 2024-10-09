"use client";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { CalendarLarge } from "~/components/ui/calendar";
import React from "react";
import { type DateRange } from "react-day-picker";
import { useParams, useSearchParams } from "next/navigation";
import ReservationDataCard from "./ReservationDataForm";
import MapComponent from "./MapComponent";
import ImageDisplay from "./ImageDisplay";
import {
  parse,
  format,
  addDays,
  isValid,
  max,
  differenceInCalendarDays,
} from "date-fns";
import { de } from "date-fns/locale";
import { useRouter } from "next/navigation";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id || isNaN(Number(id))) {
    return "Du HS";
  }
  const router = useRouter();
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });
  const searchParams = useSearchParams();
  const sAdults = verifyAmmountParam(searchParams.get("adults"), 1, 5, 1);
  const sChildren = verifyAmmountParam(searchParams.get("children"), 0, 5, 0);
  const sPets = verifyAmmountParam(searchParams.get("pets"), 0, 5, 0);

  const initialDateRange = verifyDateParam(
    searchParams.get("from"),
    searchParams.get("to"),
  );
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      router.push(`/rooms/${id}`);
      return initialDateRange;
    },
  );
  const [guests, setGuests] = React.useState<Guests>({
    adults: sAdults,
    children: sChildren,
    pets: sPets,
  });

  function verifyAmmountParam(
    queryParam: string | null | undefined,
    min: number,
    max: number,
    def: number,
  ) {
    if (queryParam && !isNaN(Number(queryParam))) {
      if (Number(queryParam) >= min && Number(queryParam) <= max) {
        return Number(queryParam);
      }
    }
    return def;
  }

  function verifyDateParam(
    from: string | null | undefined,
    to: string | null | undefined,
  ): DateRange {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const parseDate = (
      dateString: string | null | undefined,
    ): Date | undefined => {
      if (!dateString) return undefined;
      const parsedDate = parse(dateString, "dd.MM.yyyy", new Date());
      return isValid(parsedDate) ? parsedDate : undefined;
    };

    let fromDate = parseDate(from);
    let toDate = parseDate(to);

    // Wenn weder from noch to gegeben sind
    if (!fromDate && !toDate) {
      fromDate = addDays(today, 7);
      toDate = addDays(fromDate, 5);
    }
    // Wenn nur from gegeben ist
    else if (fromDate && !toDate) {
      toDate = addDays(fromDate, 5);
    }
    // Wenn nur to gegeben ist
    else if (!fromDate && toDate) {
      fromDate = max([addDays(toDate, -5), today]);
    }

    // Sicherstellen, dass from nicht in der Vergangenheit liegt
    if (fromDate && fromDate < today) {
      fromDate = today;
    }

    // Sicherstellen, dass to nicht vor from liegt und mindestens einen Tag in der Zukunft
    if (fromDate && toDate && toDate <= fromDate) {
      toDate = addDays(fromDate, 1);
    }

    // Sicherstellen, dass to mindestens einen Tag in der Zukunft liegt
    if (toDate && toDate <= today) {
      toDate = addDays(today, 1);
    }

    return {
      from: fromDate,
      to: toDate,
    };
  }

  const handleSelectCheckIn = (date: Date | undefined) => {
    setDateRange((prev) => ({
      from: date,
      to: prev?.to && date && date >= prev.to ? undefined : prev?.to,
    }));
  };

  const handleSelectCheckOut = (date: Date | undefined) => {
    setDateRange((prev) => ({
      from: prev?.from,
      to: date,
    }));
  };

  const handleChange = (type: keyof Guests) => (value: number) => {
    setGuests((prev) => ({ ...prev, [type]: value }));
  };

  const updateParams = () => {
    const params = new URLSearchParams();
    if (dateRange?.from)
      params.set("from", format(dateRange.from, "dd.MM.yyyy", { locale: de }));
    if (dateRange?.to)
      params.set("to", format(dateRange.to, "dd.MM.yyyy", { locale: de }));
    params.set("adults", guests.adults.toString());
    params.set("children", guests.children.toString());
    params.set("pets", guests.pets.toString());
    return params;
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
              <h1 className="text-2xl font-medium">Über diese Unterkunft</h1>
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
              <h1 className="text-2xl font-medium">
                Das Bietet diese Unterkunft
              </h1>
              {listing.data?.amenities ? (
                <div className="mt-3 grid w-full grid-cols-4 gap-5">
                  {listing.data.amenities.map((amenity) => (
                    <div
                      key={amenity.id}
                      className={
                        "flex cursor-pointer flex-col items-start gap-2 rounded-md p-4 ring-1 ring-gray-300 hover:bg-gray-100"
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
              <h1 className="text-2xl font-medium">
                {dateRange?.from
                  ? dateRange.to
                    ? differenceInCalendarDays(dateRange.to, dateRange.from) +
                      (differenceInCalendarDays(dateRange.to, dateRange.from) >
                      1
                        ? " Nächte "
                        : " Nacht ") +
                      listing.data?.location
                    : "Check-Out Datum wählen"
                  : "Chek-In Datum wählen"}
              </h1>
              <CalendarLarge
                mode="range"
                defaultMonth={dateRange?.from}
                selected={dateRange}
                onSelect={setDateRange}
                numberOfMonths={2}
              />
            </div>
            <Separator></Separator>
            <div className="mt-10 flex flex-col space-y-4">
              <h1 className="text-2xl font-medium">Hier wirst du sein</h1>
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
          <div className="relative flex w-1/3 justify-end py-8 pl-10">
            <ReservationDataCard
              listing_id={listing.data?.id as number}
              dateRange={dateRange}
              handleSelectCheckIn={handleSelectCheckIn}
              handleSelectCheckOut={handleSelectCheckOut}
              guests={guests}
              handleChange={handleChange}
            ></ReservationDataCard>
          </div>
        </div>
        <Separator></Separator>
      </div>
    </div>
  );
}
