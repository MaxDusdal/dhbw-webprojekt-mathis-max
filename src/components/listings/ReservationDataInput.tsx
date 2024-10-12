import { format } from "date-fns";
import { Calendar } from "../ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";
import { de } from "date-fns/locale";
import { DateRange, Matcher } from "react-day-picker";
import QuantitySelector from "./QuantitySelector";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type ReservationData = {
  dateRange: DateRange | undefined;
  handleSelectCheckIn?: (date: Date | undefined) => void;
  handleSelectCheckOut?: (date: Date | undefined) => void;
  guests: Guests;
  maxGuests?: number;
  handleChange?: (type: keyof Guests) => (value: number) => void;
};

export default function ReservationDataInput({
  dateRange,
  handleSelectCheckIn,
  handleSelectCheckOut,
  guests,
  handleChange,
  maxGuests,
}: ReservationData) {
  return (
    <div className="mt-5 flex w-full flex-col overflow-hidden rounded-md ring-1 ring-gray-400">
      <div className="flex w-full border-b border-gray-400">
        <div className="h-full w-1/2 border-r border-gray-400">
          <ReservationDateSelector
            disabled={(date) => {
              const today = new Date();
              return (
                date <
                new Date(today.getFullYear(), today.getMonth(), today.getDate())
              );
            }}
            description="CHECK-IN"
            date={dateRange?.from}
            handleSelect={handleSelectCheckIn}
          ></ReservationDateSelector>
        </div>
        <div className="h-full w-1/2">
          <ReservationDateSelector
            disabled={(date) => {
              const today = new Date();
              return (
                date <=
                (dateRange?.from
                  ? dateRange.from
                  : new Date(
                      today.getFullYear(),
                      today.getMonth(),
                      today.getDate(),
                    ))
              );
            }}
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
          maxGuests={maxGuests || 9999}
        ></GuestSelector>
      </div>
    </div>
  );
}
type DateSelecorProps = {
  description: string;
  date: Date | undefined;
  handleSelect?: (date: Date | undefined) => void;
  disabled?: Matcher | Matcher[] | undefined;
};

function ReservationDateSelector({
  description,
  date,
  handleSelect,
  disabled,
}: DateSelecorProps) {
  if (handleSelect) {
    return (
      <Popover>
        <PopoverTrigger asChild>
          <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 p-2 hover:bg-gray-100">
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
            disabled={disabled}
            initialFocus
          />
        </PopoverContent>
      </Popover>
    );
  }
  return (
    <div className="flex w-full flex-col justify-start space-y-1 p-2">
      <p className="text-[10px] font-semibold">{description}</p>
      <p className="text-sm">
        {date ? (
          format(date, "dd.MM.yyyy", { locale: de })
        ) : (
          <span className="text-muted-foreground">Unbekanntes Datum</span>
        )}
      </p>
    </div>
  );
}

type GuestSelectorProps = {
  guests: Guests;
  maxGuests: number;
  handleChange?: (type: keyof Guests) => (value: number) => void;
};

function GuestSelector({
  guests,
  handleChange,
  maxGuests,
}: GuestSelectorProps) {
  const guestSummary = `${guests.adults} ${guests.adults > 1 ? "Gäste" : "Gast"}${
    guests.children > 0
      ? `, ${guests.children} ${guests.children > 1 ? "Kinder" : "Kind"}`
      : ""
  }${
    guests.pets > 0
      ? `, ${guests.pets} ${guests.pets > 1 ? "Haustiere" : "Haustier"}`
      : ""
  }`;

  if (handleChange) {
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
            max={maxGuests - guests.children}
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
            max={maxGuests - guests.adults}
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
  return (
    <div className="flex w-full flex-col justify-start space-y-1 rounded-b-md p-2">
      <p className="text-[10px] font-semibold">GÄSTE</p>
      <p className="text-sm">{guestSummary}</p>
    </div>
  );
}
