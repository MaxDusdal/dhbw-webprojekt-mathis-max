import { round } from "lodash";
import { format, differenceInCalendarDays } from "date-fns";
import { Button } from "~/components/ui/button";
import { Calendar } from "~/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Separator } from "~/components/ui/separator";
import { type DateRange } from "react-day-picker";
import QuantitySelector from "~/components/listings/QuantitySelector";
import { number } from "zod";
import { de } from "date-fns/locale";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import router from "next/navigation";
import ReservationDataInput from "~/components/listings/ReservationDataInput";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type ReservationData = {
  listing_id: number;
  price_per_night: number;
  dateRange: DateRange | undefined;
  handleSelectCheckIn: (date: Date | undefined) => void;
  handleSelectCheckOut: (date: Date | undefined) => void;
  guests: Guests;
  maxGuests: number;
  handleChange: (type: keyof Guests) => (value: number) => void;
  getUpdatedParams: () => URLSearchParams;
};

export default function ReservationCard({
  listing_id,
  price_per_night,
  dateRange,
  handleSelectCheckIn,
  handleSelectCheckOut,
  guests,
  maxGuests,
  handleChange,
  getUpdatedParams,
}: ReservationData) {
  const searchParams = useSearchParams();

  return (
    <div className="sticky top-20 h-fit min-w-[379px] rounded-xl p-6 shadow-lg ring-1 ring-gray-300">
      <p className="text-base font-light">
        <span className="text-2xl font-medium">{`${price_per_night}€`}</span>
        Nacht
      </p>
      <ReservationDataInput
        dateRange={dateRange}
        guests={guests}
        maxGuests={maxGuests}
        handleChange={handleChange}
        handleSelectCheckIn={handleSelectCheckIn}
        handleSelectCheckOut={handleSelectCheckOut}
      ></ReservationDataInput>
      <Link href={`/rooms/${listing_id}/book?${getUpdatedParams()}`}>
        <Button className="mt-5 h-12 w-full bg-blue-600 text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Reservieren
        </Button>
      </Link>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <ReservationOverview
          dateRange={dateRange}
          price_per_night={round(price_per_night)}
        ></ReservationOverview>
      </div>
    </div>
  );
}

type DateSelecorProps = {
  description: string;
  date: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
};

type OverviewProps = {
  dateRange: DateRange | undefined;
  price_per_night: number;
};
function ReservationOverview({ dateRange, price_per_night }: OverviewProps) {
  if (!dateRange?.from || !dateRange.to) {
    return <></>;
  }
  const differenceInDays = differenceInCalendarDays(
    dateRange.to,
    dateRange.from,
  );
  return (
    <>
      <div className="flex flex-col items-center justify-center space-y-2 text-center text-sm font-light text-muted-foreground">
        <p>Du musst noch nichts bezahlen.</p>
        <p>Der Preis pro Nacht beinhaltet die MwSt. und sämtliche Gebühren.</p>
      </div>
      <div className="flex w-full flex-col space-y-4 font-light">
        <div className="flex w-full justify-between">
          <p className="w-full">
            {price_per_night + "€ x " + differenceInDays + " Nächte"}
          </p>
          <p className="w-fit">{price_per_night * differenceInDays + "€"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p className="w-full">Luftnbn-Servicegebühr</p>
          <p className="w-fit">
            {10 + round((price_per_night * differenceInDays) / 10) + "€"}
          </p>
        </div>
        <Separator></Separator>
        <div className="flex w-full justify-between">
          <p className="w-full font-medium">Gesamtbetrag</p>
          <p className="w-fit font-medium">
            {price_per_night * differenceInDays +
              10 +
              round((price_per_night * differenceInDays) / 10) +
              "€"}
          </p>
        </div>
      </div>
    </>
  );
}
