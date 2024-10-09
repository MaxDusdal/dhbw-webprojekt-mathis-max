import React, { useEffect, useState, useRef } from "react";
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
  Suggestion,
} from "use-places-autocomplete";
import { useLoadScript, Libraries } from "@react-google-maps/api";

const libraries: Libraries = ["places"];

interface Location {
  address: string;
  lat: number;
  lng: number;
}

interface SearchBarProps {
  onSelect: (location: Location) => void;
}

function SearchBar({ onSelect }: SearchBarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const {
    ready,
    value,
    suggestions: { status, data },
    setValue,
    clearSuggestions,
  } = usePlacesAutocomplete({
    requestOptions: {
      types: ["(cities)", "country"],
    },
    debounce: 300,
    cache: 24 * 60 * 60,
  });

  useEffect(() => {
    console.log("Places Autocomplete ready:", ready);
  }, [ready]);

  useEffect(() => {
    console.log("Suggestions status:", status);
    console.log("Suggestions data:", data);
    setIsOpen(status === "OK" && data.length > 0);
  }, [status, data]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    console.log("Input value:", e.target.value);
    setValue(e.target.value);
  };

  const handleSelect = async (address: string) => {
    console.log("Selected address:", address);
    setValue(address, false);
    clearSuggestions();
    setIsOpen(false);
    try {
      const results = await getGeocode({ address });
      console.log("Geocode results:", results);
      if (results[0]) {
        const { lat, lng } = await getLatLng(results[0]);
        console.log("Latitude:", lat, "Longitude:", lng);
        onSelect({ address, lat, lng });
      } else {
        console.error("No results found for the given address");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <input
        value={value}
        onChange={handleInput}
        disabled={!ready}
        placeholder="Suche nach Städten oder Ländern"
        className="w-full rounded-md border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
      {isOpen && (
        <div className="absolute z-10 mt-1 w-full rounded-md border border-gray-300 bg-white shadow-lg">
          <ul className="max-h-60 overflow-auto py-1">
            {data.map((suggestion: Suggestion) => (
              <li
                key={suggestion.place_id}
                onClick={() => handleSelect(suggestion.description)}
                className="cursor-pointer px-3 py-2 hover:bg-gray-100"
              >
                {suggestion.description}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default function PlacesAutocomplete({
  onSelect,
}: {
  onSelect: (location: Location) => void;
}) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || "",
    libraries,
  });

  if (loadError) {
    console.error("Error loading Google Maps API:", loadError);
    return <div>Error loading Google Maps API</div>;
  }

  if (!isLoaded) return <div>Loading...</div>;

  return <SearchBar onSelect={onSelect} />;
}
