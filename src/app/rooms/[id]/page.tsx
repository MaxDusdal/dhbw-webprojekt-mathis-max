"use client";
import Image from "next/image";
import { Separator } from "~/components/ui/separator";
import { api } from "~/trpc/react";
import { Calendar, CalendarLarge } from "~/components/ui/calendar";
import { addDays, format, differenceInCalendarDays } from "date-fns";
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { round } from "lodash";
import QuantitySelector from "../create-listing/QuantitySelector";
import { useParams } from "next/navigation";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function RoomDetail() {
  const { id } = useParams<{ id: string }>();
  if (!id || isNaN(Number(id))) {
    return "Du HS"
  }
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });
  
  const [dateRange, setDateRange] = React.useState<DateRange | undefined>({
    from: new Date(),
    to: addDays(new Date(), 5),
  });
  const [guests, setGuests] = React.useState<Guests>({
    adults: 1,
    children: 0,
    pets: 0,
  });

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

  const guestSummary = `${guests.adults} ${guests.adults > 1 ? "Gäste" : "Gast"}${
    guests.children > 0
      ? `, ${guests.children} ${guests.children > 1 ? "Kinder" : "Kind"}`
      : ""
  }${
    guests.pets > 0
      ? `, ${guests.pets} ${guests.pets > 1 ? "Haustiere" : "Haustier"}`
      : ""
  }`;

  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col p-10">
        <h1 className="text-2xl font-medium">{listing.data?.title}</h1>
        <div className="mt-6 grid h-[516px] w-full grid-cols-2 gap-2 overflow-hidden rounded-2xl">
          <div className="h-full w-full bg-gray-200"></div>
          <div className="h-fullw-full grid grid-cols-2 gap-2">
            <div className="h-full w-full bg-gray-200"></div>
            <div className="h-full w-full bg-gray-200"></div>
            <div className="h-full w-full bg-gray-200"></div>
            <div className="h-full w-full bg-gray-200"></div>
          </div>
        </div>
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
                        ? " Nächte"
                        : " Nacht") +
                      "  in Stadt xy"
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
          </div>
          <div className="relative flex w-1/3 justify-end py-8 pl-10">
            <div className="sticky top-20 h-fit w-96 rounded-xl p-6 shadow-lg ring-1 ring-gray-300">
              <p className="text-base font-light">
                <span className="text-2xl font-medium">85€</span> Nacht
              </p>
              <div className="mt-5 flex w-full flex-col rounded-md ring-1 ring-gray-400">
                <div className="flex w-full border-b border-gray-400">
                  <div className="h-full w-1/2 border-r border-gray-400">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-tl-md p-2 hover:bg-gray-100">
                          <p className="text-[10px] font-semibold">CHECK-IN</p>
                          <p className="text-sm">
                            {dateRange?.from ? (
                              format(dateRange.from, "P")
                            ) : (
                              <span className="text-muted-foreground">
                                Datum hinzufügen
                              </span>
                            )}
                          </p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange?.from}
                          onSelect={handleSelectCheckIn}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                  <div className="h-full w-1/2">
                    <Popover>
                      <PopoverTrigger asChild>
                        <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-tr-md p-2 hover:bg-gray-100">
                          <p className="text-[10px] font-semibold">CHECK-OUT</p>
                          <p className="text-sm">
                            {dateRange?.to ? (
                              format(dateRange.to, "P")
                            ) : (
                              <span className="text-muted-foreground">
                                Datum hinzufügen
                              </span>
                            )}
                          </p>
                        </div>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0">
                        <Calendar
                          mode="single"
                          selected={dateRange?.to}
                          onSelect={handleSelectCheckOut}
                          initialFocus
                          disabled={(date) =>
                            !dateRange?.from || date <= dateRange.from
                          }
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>
                <div className="h-full w-full">
                  <Popover>
                    <PopoverTrigger asChild>
                      <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-b-md p-2 hover:bg-gray-100">
                        <p className="text-[10px] font-semibold">GÄSTE</p>
                        <p className="text-sm">{guestSummary}</p>
                      </div>
                    </PopoverTrigger>
                    <PopoverContent className="w-[296px] px-3">
                      <QuantitySelector
                        onChange={handleChange("adults")}
                        value={guests.adults}
                        min={1}
                        max={5}
                        label={
                          <div className="flex flex-col">
                            <span className="text-base font-medium">
                              Erwachsene
                            </span>
                            <span className="text-sm font-light">
                              Ab 13 Jahren
                            </span>
                          </div>
                        }
                      />
                      <QuantitySelector
                        onChange={handleChange("children")}
                        value={guests.children}
                        max={5}
                        label={
                          <div className="flex flex-col">
                            <span className="text-base font-medium">
                              Kinder
                            </span>
                            <span className="text-sm font-light">
                              Bis 12 Jahren
                            </span>
                          </div>
                        }
                      />
                      <QuantitySelector
                        onChange={handleChange("pets")}
                        value={guests.pets}
                        max={5}
                        label={
                          <div className="flex flex-col">
                            <span className="text-base font-medium">
                              Haustiere
                            </span>
                          </div>
                        }
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
              <Button className="mt-5 h-12 w-full bg-[#FF385C] bg-[linear-gradient(to_right,#E61E4D_0%,#E31C5F_50%,#D70466_100%)] text-base text-white">
                Reservieren
              </Button>
              <div className="mt-5 flex w-full flex-col space-y-4">
                <div className="flex flex-col items-center justify-center space-y-2 text-center text-sm font-light text-muted-foreground">
                  <p>Du musst noch nichts bezahlen.</p>
                  <p>
                    Der Preis pro Nacht beinhaltet die MwSt. und sämtliche
                    Gebühren.
                  </p>
                </div>
                {dateRange?.from ? (
                  dateRange.to ? (
                    <div className="flex w-full flex-col space-y-4 font-light">
                      <div className="flex w-full justify-between">
                        <p className="w-full">
                          {"85€" +
                            " x " +
                            differenceInCalendarDays(
                              dateRange.to,
                              dateRange.from,
                            ) +
                            " Nächte"}
                        </p>
                        <p className="w-9">
                          {85 *
                            differenceInCalendarDays(
                              dateRange.to,
                              dateRange.from,
                            ) +
                            "€"}
                        </p>
                      </div>
                      <div className="flex w-full justify-between">
                        <p className="w-full">Luftnbn-Servicegebühr</p>
                        <p className="w-9">
                          {10 +
                            round(
                              (85 *
                                differenceInCalendarDays(
                                  dateRange.to,
                                  dateRange.from,
                                )) /
                                10,
                            ) +
                            "€"}
                        </p>
                      </div>
                      <Separator></Separator>
                      <div className="flex w-full justify-between">
                        <p className="w-full font-medium">Gesamtbetrag</p>
                        <p className="w-9 font-medium">
                          {85 *
                            differenceInCalendarDays(
                              dateRange.to,
                              dateRange.from,
                            ) +
                            10 +
                            round(
                              (85 *
                                differenceInCalendarDays(
                                  dateRange.to,
                                  dateRange.from,
                                )) /
                                10,
                            ) +
                            "€"}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <></>
                  )
                ) : (
                  <></>
                )}
              </div>
            </div>
          </div>
        </div>
        <Separator></Separator>
      </div>
    </div>
  );
}
