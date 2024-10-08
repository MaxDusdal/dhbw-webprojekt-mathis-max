import React, { useEffect } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { addDays, format, isValid, max, parse } from "date-fns";
import { DateRange, Matcher } from "react-day-picker";
import { Calendar } from "./ui/calendar";
import { Separator } from "./ui/separator";
import QuantitySelector from "~/components/listings/QuantitySelector";
import { Search } from "lucide-react";
import { useRouter, useSearchParams } from "next/navigation";
import { de } from "date-fns/locale";
import {
  verifyDateParam,
  verifyAmountParam,
  useReservation,
} from "~/hooks/useReservation";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

export default function ListingSearch() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sAdults = verifyAmountParam(searchParams.get("adults"), 1, 5, 1);
  const sChildren = verifyAmountParam(searchParams.get("children"), 0, 5, 0);
  const sPets = verifyAmountParam(searchParams.get("pets"), 0, 5, 0);
  const sSearch = searchParams.get("location");
  const initialDateRange = verifyDateParam(
    searchParams.get("from"),
    searchParams.get("to"),
  );
  const [search, setSearch] = React.useState<string>(sSearch || "");

  const {
    dateRange,
    setDateRange,
    guests,
    handleSelectCheckIn,
    handleSelectCheckOut,
    handleChange,
  } = useReservation(initialDateRange, sAdults, sChildren, sPets);
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

    router.push(`/?${params.toString()}`);
    window.location.reload();
  };

  return (
    <div className="mb-8 flex items-center overflow-hidden rounded-3xl p-0 shadow-lg ring-1 ring-gray-300 max-[1080px]:w-full min-[1080px]:min-w-fit min-[1080px]:rounded-full">
      <div className="flex max-[1080px]:w-full max-[1080px]:flex-col">
        <div className="w-full min-[1080px]:w-[292px]">
          <LocationSearch
            description="WOHIN"
            search={search}
            setSearch={setSearch}
          ></LocationSearch>
        </div>
        <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
        <div className="w-full min-[1080px]:w-[200px]">
          <ReservationDateSelector
            disabled={(date) => {
              const today = new Date();
              return (
                date <
                new Date(today.getFullYear(), today.getMonth(), today.getDate())
              );
            }}
            handleSelect={handleSelectCheckIn}
            description="CHECK-IN"
            date={dateRange?.from}
          ></ReservationDateSelector>
        </div>
      </div>
      <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
      <div className="flex max-[1080px]:w-full max-[1080px]:flex-col-reverse">
        <div className="w-full min-[1080px]:w-[200px]">
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
            handleSelect={handleSelectCheckOut}
            description="CHECK-OUT"
            date={dateRange?.to}
          ></ReservationDateSelector>
        </div>
        <Separator orientation="vertical" className="mx-1 h-1/2"></Separator>
        <div className="w-full min-[1080px]:w-[282px]">
          <GuestSelector
            handleChange={handleChange}
            guests={guests}
          ></GuestSelector>
        </div>
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
  disabled: Matcher | Matcher[] | undefined;
};

function ReservationDateSelector({
  description,
  date,
  handleSelect,
  disabled,
}: DateSelecorProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <div className="flex cursor-pointer flex-col justify-center space-y-1 rounded-3xl px-8 py-2 hover:bg-gray-100 min-[1080px]:rounded-full">
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
          disabled={disabled}
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
        <div className="flex w-full cursor-pointer flex-col justify-start space-y-1 rounded-full px-8 py-2 hover:bg-gray-100 min-[1080px]:rounded-full">
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

interface LocationSearchProps {
  description: string;
  search: string;
  setSearch: (value: string) => void;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
}

function LocationSearch({
  description,
  search,
  setSearch,
}: LocationSearchProps) {
  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isSearchMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchMode]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (search.length > 2) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/places?input=${encodeURIComponent(search)}`,
          );
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
          console.log("data", data);
          setSuggestions(data.predictions);
          setShowDropdown(true);
        } catch (error) {
          console.error("Error fetching suggestions:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSuggestions([]);
        setShowDropdown(false);
      }
    };

    const debounceTimer = setTimeout(fetchSuggestions, 200);
    return () => clearTimeout(debounceTimer);
  }, [search]);

  const handleClick = () => {
    setIsSearchMode(true);
  };

  const handleBlur = () => {
    // Delay hiding search mode to allow selecting from dropdown
    setTimeout(() => setIsSearchMode(false), 200);
  };

  const handleSuggestionClick = (suggestion: PlaceSuggestion) => {
    setSearch(suggestion.description);
    setShowDropdown(false);
    setIsSearchMode(false);
  };

  return (
    <div className="relative">
      <div
        className="flex cursor-pointer flex-col justify-center space-y-1 rounded-3xl px-8 py-2 hover:bg-gray-100 min-[1080px]:rounded-full"
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
          <p className="overflow-hidden text-nowrap text-base">{search}</p>
        ) : (
          <p className="text-nowrap text-base text-muted-foreground">
            Reiseziel eingeben
          </p>
        )}
      </div>
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute z-10 mt-1 w-full rounded-md bg-white shadow-lg"
        >
          {isLoading ? (
            <div className="p-2 text-center">Loading...</div>
          ) : suggestions.length > 0 ? (
            <ul className="max-h-60 overflow-auto py-1">
              {suggestions.map((suggestion) => (
                <li
                  key={suggestion.place_id}
                  className="cursor-pointer px-4 py-2 hover:bg-gray-100"
                  onClick={() => handleSuggestionClick(suggestion)}
                >
                  {suggestion.description}
                </li>
              ))}
            </ul>
          ) : (
            <div className="p-2 text-center">No results found</div>
          )}
        </div>
      )}
    </div>
  );
}
