import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { addDays, format, isValid, max, parse } from "date-fns";
import { DateRange } from "react-day-picker";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import QuantitySelector from "~/app/rooms/create-listing/QuantitySelector";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { de } from "date-fns/locale";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function ListingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sAdults = verifyAmmountParam(searchParams.get("adults"), 1, 5, 1);
  const sChildren = verifyAmmountParam(searchParams.get("children"), 0, 5, 0);
  const sPets = verifyAmmountParam(searchParams.get("pets"), 0, 5, 0);
  const initialDateRange = verifyDateParam(
    searchParams.get("from"),
    searchParams.get("to"),
  );

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    initialDateRange,
  );
  const [guests, setGuests] = React.useState<Guests>({
    adults: sAdults,
    children: sChildren,
    pets: sPets,
  });
  const [search, setSearch] = React.useState<string>("");

  function verifyAmmountParam(
    queryParam: string | null | undefined,
    min: number,
    max: number,
    def: number,
  ) {
    if (queryParam && !isNaN(Number(queryParam))) {
      if (Number(queryParam) > min && Number(queryParam) < max) {
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

  const handleSearch = () => {
    const params = new URLSearchParams();

    if (search) params.set("location", search);
    if (dateRange?.from)
      params.set("from", format(dateRange.from, "dd.MM.yyyy", { locale: de }));
    if (dateRange?.to)
      params.set("to", format(dateRange.to, "dd.MM.yyyy", { locale: de }));
    params.set("adults", guests.adults.toString());
    params.set("children", guests.children.toString());
    params.set("pets", guests.pets.toString());

    router.push(`/rooms?${params.toString()}`);
    window.location.reload();
  };

  return (
    <div className="mb-8 flex min-w-fit items-center rounded-full p-0 shadow-lg ring-1 ring-gray-300">
      <div className="w-[292px]">
        <LocationSearch
          description="WOHIN"
          search={search}
          setSearch={setSearch}
        ></LocationSearch>
      </div>
      <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
      <div className="w-[200px]">
        <ReservationDateSelector
          handleSelect={handleSelectCheckIn}
          description="CHECK-IN"
          date={dateRange?.from}
        ></ReservationDateSelector>
      </div>
      <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
      <div className="w-[200px]">
        <ReservationDateSelector
          handleSelect={handleSelectCheckOut}
          description="CHECK-OUT"
          date={dateRange?.to}
        ></ReservationDateSelector>
      </div>
      <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
      <div className="w-[282px]">
        <GuestSelector
          handleChange={handleChange}
          guests={guests}
        ></GuestSelector>
      </div>
      <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
      <div
        className="mr-2 flex h-full cursor-pointer items-center justify-center"
        onClick={handleSearch}
      >
        <div className="flex aspect-square h-[46px] w-[46px] items-center justify-center rounded-full bg-blue-600 transition hover:bg-blue-500 active:scale-95">
          <Search color="white" className="h-6 w-6" />
        </div>
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
        <div className="flex cursor-pointer flex-col justify-center space-y-1 rounded-full px-8 py-2 hover:bg-gray-100">
          <p className="text-[12px] font-semibold">{description}</p>
          <p className="text-nowrap text-base">
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
        <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-full px-8 py-2 hover:bg-gray-100">
          <p className="text-[12px] font-semibold">GÄSTE</p>
          {guests.adults > 0 ? (
            <p className="text-nowrap text-base">{guestSummary}</p>
          ) : (
            <p className="text-nowrap text-base text-muted-foreground">
              Gäste hinzufügen
            </p>
          )}
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

type LocationSearchProps = {
  description: string;
  search: string;
  setSearch: (search: string) => void;
};
function LocationSearch({
  description,
  search,
  setSearch,
}: LocationSearchProps) {
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isSearchMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchMode]);

  const handleClick = () => {
    setIsSearchMode(true);
  };

  const handleBlur = () => {
    setIsSearchMode(false);
  };

  return (
    <div
      className="flex cursor-pointer flex-col justify-center space-y-1 rounded-full px-8 py-2 hover:bg-gray-100"
      onClick={handleClick}
    >
      <p className="text-[12px] font-semibold">{description}</p>
      {isSearchMode ? (
        <input
          ref={inputRef}
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          onBlur={handleBlur}
          className="m-0 border-none bg-transparent p-0 text-base outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
          style={{ WebkitAppearance: "none", boxShadow: "none" }}
          placeholder="Reiseziel eingeben"
        />
      ) : search ? (
        <p className="text-nowrap text-base">{search}</p>
      ) : (
        <p className="text-nowrap text-base text-muted-foreground">
          Reiseziel eingeben
        </p>
      )}
    </div>
  );
}
