"use client";
import { useParams, useSearchParams } from "next/navigation";
import React from "react";
import { Separator } from "~/components/ui/separator";
import ReservationBookingOverview from "./ReservationOverview";
import {
  useReservation,
  verifyAmountParam,
  verifyDateParamWithDefault,
} from "~/hooks/useReservation";
import { api } from "~/trpc/react";
import { PaymentMethod } from "./paymentMethod";
import { format } from "date-fns";
import { de } from "date-fns/locale";
import { Button } from "~/components/ui/button";

type CoverData = {
  image_url: string;
  title: string;
  description: string;
};

export default function BookingOverview() {
  const { id } = useParams<{ id: string }>();
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });
  const coverData: CoverData = {
    image_url: listing.data?.images[0]?.url || "https://picsum.photos/200",
    title: listing.data?.title || "Unterkunft",
    description: "Unterkuft: Wohnung",
  };
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
        <div className="flex w-full flex-row">
          <div className="flex w-2/3 flex-col items-center space-y-10 py-8 pr-8">
            <div className="flex flex-col space-y-8">
              <div className="flex flex-col space-y-8">
                <h1 className="text-2xl font-medium">Bestellübersicht</h1>
                <p>
                  Prüfe bitte ob die Check-In und Check-Out Daten, sowie die
                  angegebenen Gäste richtig sind. Ansonsten kannst du die rechts
                  korrigieren.
                </p>

                <div className="grid grid-cols-2">
                  <p className="font-medium">Check-In:</p>
                  <p>
                    {dateRange?.from
                      ? format(dateRange.from, "dd.MM.yyyy", { locale: de })
                      : "error"}
                  </p>
                  <p className="font-medium">Check-Out:</p>
                  <p>
                    {dateRange?.to
                      ? format(dateRange.to, "dd.MM.yyyy", { locale: de })
                      : "error"}
                  </p>
                </div>
              </div>
              <Separator></Separator>
              <div className="flex w-full justify-center">
                <PaymentMethod></PaymentMethod>
              </div>
              <Separator></Separator>
              <div className="flex flex-col space-y-8">
                <h1 className="text-2xl font-medium">
                  Stornierungsbedingungen
                </h1>
                <p>
                  Kostenlose Stornierung bis zu 7 Tage vor Check-In. Danach ist
                  die Buchung nicht mehr erstattungsfähig.
                </p>
              </div>
              <Separator></Separator>
              <div className="flex flex-col space-y-8">
                <h1 className="text-2xl font-medium">Grundregeln</h1>
                <p>
                  Wir bitten alle Gäste, ein paar einfache Dinge zu beachten,
                  die großartige Gäste ausmachen. Befolge die Hausregeln.
                  Behandle deine gebuchte Unterkunft, als ob sie dein eigenes
                  Zuhause wäre.
                </p>
              </div>
              <Separator></Separator>
              <div>
                <Button
                  className="h-14 w-[300px] cursor-pointer bg-blue-600 text-lg hover:bg-blue-500 disabled:bg-gray-400"
                  disabled={true}
                >
                  Bestätigen und Bezahlen
                </Button>
              </div>
            </div>
          </div>
          <div className="relative flex w-1/3 justify-end py-8 pl-10">
            <ReservationBookingOverview
              coverData={coverData}
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
