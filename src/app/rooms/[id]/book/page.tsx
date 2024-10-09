"use client";
import { addDays, isValid, max, parse } from "date-fns";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DateRange } from "react-day-picker";
import { Separator } from "~/components/ui/separator";
import ReservationBookingOverview from "./ReservationOverview";
import {
  useReservation,
  verifyAmountParam,
  verifyDateParamWithDefault,
} from "~/hooks/useReservation";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function BookingOverview() {
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

  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col p-10">
        <h1 className="text-2xl font-medium">Bestätigen und Bezahlen</h1>
        <div className="flex w-full flex-row">
          <div className="flex w-2/3 flex-col space-y-10 py-8 pr-8">
            <div className="flex flex-col space-y-8">
              <h1 className="text-2xl font-medium">Ihre Reise</h1>
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
          </div>
          <div className="relative flex w-1/3 justify-end py-8 pl-10">
            <ReservationBookingOverview
              dateRange={dateRange}
              guests={guests}
              handleChange={handleChange}
              handleSelectCheckIn={handleSelectCheckIn}
              handleSelectCheckOut={handleSelectCheckOut}
            ></ReservationBookingOverview>
          </div>
        </div>
        <Separator></Separator>
      </div>
    </div>
  );
}
