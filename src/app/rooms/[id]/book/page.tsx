"use client";
import { addDays, isValid, max, parse } from "date-fns";
import { useSearchParams } from "next/navigation";
import React from "react";
import { DateRange } from "react-day-picker";
import { Separator } from "~/components/ui/separator";
import ReservationBookingOverview from "./ReservationOverview";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function BookingOverview() {
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
  return (
    <div className="flex w-full justify-center">
      <div className="flex max-w-7xl flex-grow flex-col p-10">
        <h1 className="text-2xl font-medium">Ihre Reserviereung</h1>
        <div className="flex w-full flex-row">
          <div className="flex w-2/3 flex-col space-y-10 py-8 pr-8">
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
