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

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type ReservationData = {
  listing_id: number;
  dateRange: DateRange | undefined;
  handleSelectCheckIn: (date: Date | undefined) => void;
  handleSelectCheckOut: (date: Date | undefined) => void;
  guests: Guests;
  handleChange: (type: keyof Guests) => (value: number) => void;
};

export default function ReservationDataCard({
  listing_id,
  dateRange,
  handleSelectCheckIn,
  handleSelectCheckOut,
  guests,
  handleChange,
}: ReservationData) {
  const searchParams = useSearchParams();
  const getUpdatedParams = () => {
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
    <div className="stick top-20 h-fit w-96 rounded-xl p-6 shadow-lg ring-1 ring-gray-300">
      <p className="text-base font-light">
        <span className="text-2xl font-medium">85€</span> Nacht
      </p>
      <div className="mt-5 flex w-full flex-col rounded-md ring-1 ring-gray-400">
        <div className="flex w-full border-b border-gray-400">
          <div className="h-full w-1/2 border-r border-gray-400">
            <ReservationDateSelector
              description="CHECK-IN"
              date={dateRange?.from}
              handleSelect={handleSelectCheckIn}
            ></ReservationDateSelector>
          </div>
          <div className="h-full w-1/2">
            <ReservationDateSelector
              description="CHECK-OUT"
              date={dateRange?.to}
              handleSelect={handleSelectCheckOut}
            ></ReservationDateSelector>
          </div>
        </div>
        <div className="h-full w-full">
          <GuestSelector
            guests={guests}
            handleChange={handleChange}
          ></GuestSelector>
        </div>
      </div>
      <Link href={`/rooms/${listing_id}/book?${getUpdatedParams()}`}>
        <Button className="mt-5 h-12 w-full bg-blue-600 text-white shadow-md hover:bg-blue-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-600">
          Reservieren
        </Button>
      </Link>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <ReservationOverview dateRange={dateRange}></ReservationOverview>
      </div>
    </div>
  );
}

type DateSelecorProps = {
  description: string;
  date: Date | undefined;
  handleSelect: (date: Date | undefined) => void;
};

function ReservationDateSelector({
  description,
  date,
  handleSelect,
}: DateSelecorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-tl-md p-2 hover:bg-gray-100">
          <p className="text-[10px] font-semibold">{description}</p>
          <p className="text-sm">
            {date ? (
              format(date, "dd.MM.yyyy", { locale: de })
            ) : (
              <span className="text-muted-foreground">Datum hinzufügen</span>
            )}
          </p>
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0">
        <Calendar
          mode="single"
          selected={date}
          onSelect={handleSelect}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}

type GuestSelectorProps = {
  guests: Guests;
  handleChange: (type: keyof Guests) => (value: number) => void;
};

function GuestSelector({ guests, handleChange }: GuestSelectorProps) {
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
              <span className="text-base font-medium">Erwachsene</span>
              <span className="text-sm font-light">Ab 13 Jahren</span>
            </div>
          }
        />
        <QuantitySelector
          onChange={handleChange("children")}
          value={guests.children}
          max={5}
          label={
            <div className="flex flex-col">
              <span className="text-base font-medium">Kinder</span>
              <span className="text-sm font-light">Bis 12 Jahren</span>
            </div>
          }
        />
        <QuantitySelector
          onChange={handleChange("pets")}
          value={guests.pets}
          max={5}
          label={
            <div className="flex flex-col">
              <span className="text-base font-medium">Haustiere</span>
            </div>
          }
        />
      </PopoverContent>
    </Popover>
  );
}

type OverviewProps = {
  dateRange: DateRange | undefined;
};
function ReservationOverview({ dateRange }: OverviewProps) {
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
            {"85€" + " x " + differenceInDays + " Nächte"}
          </p>
          <p className="w-9">{85 * differenceInDays + "€"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p className="w-full">Luftnbn-Servicegebühr</p>
          <p className="w-9">
            {10 + round((85 * differenceInDays) / 10) + "€"}
          </p>
        </div>
        <Separator></Separator>
        <div className="flex w-full justify-between">
          <p className="w-full font-medium">Gesamtbetrag</p>
          <p className="w-9 font-medium">
            {85 * differenceInDays +
              10 +
              round((85 * differenceInDays) / 10) +
              "€"}
          </p>
        </div>
      </div>
    </>
  );
}
