"use client";
import { useParams, useSearchParams } from "next/navigation";
import React, { useState } from "react";
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
import CheckoutOverview from "./CheckoutOverview";
import { PaymentMethodAnimated } from "./pamentMethodAnimated";

type CoverData = {
  image_url: string;
  title: string;
  description: string;
};

export default function BookingOverview() {
  const { id } = useParams<{ id: string }>();
  const listing = api.vacationhome.getById.useQuery({ id: Number(id) });
  const [paymentStatus, setPaymentStatus] = useState(false);
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
      <div className="flex max-w-7xl flex-grow flex-col p-5 max-[465px]:p-0 lg:p-10">
        <div className="flex w-full flex-row">
          <div className="flex w-full flex-col items-center space-y-10 py-8">
            <div className="flex flex-col space-y-8">
              <h1 className="text-3xl font-semibold">Checkout</h1>
              <Separator></Separator>
              <div className="grid w-full gap-y-10 md:gap-x-10 min-[965px]:grid-cols-2">
                <CheckoutOverview
                  price_per_night={listing.data?.pricePerNight as number}
                  coverData={coverData}
                  dateRange={dateRange}
                  guests={guests}
                  handleChange={handleChange}
                  handleSelectCheckIn={handleSelectCheckIn}
                  handleSelectCheckOut={handleSelectCheckOut}
                ></CheckoutOverview>
                <div className="flex w-full justify-center">
                  <PaymentMethodAnimated
                    paymentStatus={paymentStatus}
                    setPaymentStatus={setPaymentStatus}
                  ></PaymentMethodAnimated>
                </div>
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
              <p className="text-sm font-light">
                Indem ich auf den unten stehenden Button klicke, stimme ich den
                Hausregeln des Gastgebers bzw. der Gastgeberin, Grundregeln für
                Gäste, Richtlinien für Umbuchungen und Rückerstattungen auf
                Airbnb zu und bestätige, dass Luftbnb meine Zahlungsart belasten
                kann, wenn ich für Schäden verantwortlich bin. Es gelten die
                Zahlungsbedingungen zwischen dir und Luftbnb Payments Mannheim
              </p>
              <div>
                <Button
                  className="h-14 w-[300px] bg-blue-600 text-lg hover:bg-blue-500 max-sm:w-full"
                  disabled={!paymentStatus}
                >
                  Bestätigen und Bezahlen
                </Button>
              </div>
            </div>
          </div>
        </div>
        <Separator></Separator>
      </div>
    </div>
  );
}
