import React, { useState, useEffect, useRef } from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from "use-places-autocomplete";
import { useLoadScript } from "@react-google-maps/api";

const libraries = ["places"];

type LocationSearchProps = {
  description: string;
  search: string;
  setSearch: (search: string) => void;
  onSelect: (location: { address: string; lat: number; lng: number }) => void;
};

export default function LocationSearchAUtocomplete({
  description,
  search,
  setSearch,
  onSelect,
}: LocationSearchProps) {
  const [isSearchMode, setIsSearchMode] = useState(false);
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)", "(regions)", "country"],
    },
    debounce: 300,
  });

  useEffect(() => {
    if (isSearchMode && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearchMode]);

  useEffect(() => {
    setValue(search);
  }, [search, setValue]);

  const handleClick = () => {
    setIsSearchMode(true);
    setIsPopoverOpen(true);
  };

  const handleBlur = () => {
    setIsSearchMode(false);
    // Delay closing the popover to allow for selection
    setTimeout(() => setIsPopoverOpen(false), 200);
  };

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setValue(newValue);
    setSearch(newValue);
    setIsPopoverOpen(true);
  };

  const handleSelect = async (address: string) => {
    setValue(address, false);
    setSearch(address);
    clearSuggestions();
    setIsPopoverOpen(false);

    try {
      const results = await getGeocode({ address });
      if (results[0]) {
        const { lat, lng } = await getLatLng(results[0]);
        onSelect({ address, lat, lng });
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  if (!isLoaded) return <div>Loading...</div>;

  return (
    <Popover open={isPopoverOpen} onOpenChange={setIsPopoverOpen}>
      <PopoverTrigger asChild>
        <div
          className="flex cursor-pointer flex-col justify-center space-y-1 rounded-full px-8 py-2 hover:bg-gray-100"
          onClick={handleClick}
        >
          <p className="text-[12px] font-semibold">{description}</p>
          {isSearchMode ? (
            <input
              ref={inputRef}
              type="text"
              value={value}
              onChange={handleInput}
              onBlur={handleBlur}
              className="w-full border-none bg-transparent p-0 text-base outline-none focus:outline-none focus:ring-0 focus:ring-offset-0"
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
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        {status === "OK" && (
          <ul className="max-h-[300px] overflow-y-auto">
            {data.map(({ place_id, description }) => (
              <li
                key={place_id}
                onClick={() => handleSelect(description)}
                className="cursor-pointer p-2 hover:bg-gray-100"
              >
                {description}
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}
