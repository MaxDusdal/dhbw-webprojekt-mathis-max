import {
  ChevronRightIcon,
  MapIcon,
  MapPinIcon,
} from "@heroicons/react/20/solid";
import React, { useEffect } from "react";
import Image from "next/image";
interface LocationSearchProps {
  description: string;
  setAdressAutoCompleteReturn: (value: AdressAutoCompleteReturn) => void;
}

interface PlaceSuggestion {
  place_id: string;
  description: string;
}

interface AdressAutoCompleteReturn {
  latitude: number;
  longitude: number;
  locationDescription: string;
}

export default function AdressAutoComplete({
  description,
  setAdressAutoCompleteReturn,
}: LocationSearchProps) {
  const [search, setSearch] = React.useState("");

  const [isSearchMode, setIsSearchMode] = React.useState(false);
  const [suggestions, setSuggestions] = React.useState<PlaceSuggestion[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [showDropdown, setShowDropdown] = React.useState(false);
  const inputRef = React.useRef<HTMLInputElement>(null);
  const dropdownRef = React.useRef<HTMLDivElement>(null);
  const containerRef = React.useRef<HTMLDivElement>(null);

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
      if (search.length > 2 && isSearchMode) {
        setIsLoading(true);
        try {
          const response = await fetch(
            `/api/places?input=${encodeURIComponent(search)}`,
          );
          if (!response.ok) throw new Error("Failed to fetch suggestions");
          const data = await response.json();
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

  const handleSuggestionClick = async (suggestion: PlaceSuggestion) => {
    setSearch(suggestion.description);
    const response = await fetch(
      `/api/places/getCoordinates?address=${encodeURIComponent(
        suggestion.description,
      )}`,
    );
    const data = await response.json();
    setAdressAutoCompleteReturn({
      latitude: data.data.results[0].geometry.location.lat,
      longitude: data.data.results[0].geometry.location.lng,
      locationDescription: data.data.results[0].formatted_address,
    });
    setShowDropdown(false);
    setIsSearchMode(false);
  };

  return (
    <div ref={containerRef} className="relative">
      <input
        ref={inputRef}
        type="text"
        value={search}
        className="block w-full rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
        placeholder="Search for a location"
        onChange={(e) => setSearch(e.target.value)}
        onFocus={() => setIsSearchMode(true)}
        onBlur={() => setIsSearchMode(false)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && suggestions[0]) {
            handleSuggestionClick(suggestions[0]);
            setShowDropdown(false);
            e.preventDefault();
          }
        }}
      />
      {showDropdown && (
        <div
          ref={dropdownRef}
          className="absolute left-0 right-0 z-10 mt-1 rounded-md bg-white shadow-xl shadow-gray-200 ring-1 ring-gray-300"
        >
          {isLoading ? (
            <div className="p-2 text-center">Lade Vorschläge...</div>
          ) : (
            <ul className="max-h-60 overflow-auto py-1">
              <div className="flex justify-between">
                <p className="px-3 py-2 text-sm text-gray-500">
                  Adress-Vorschläge
                </p>
                <Image
                  src="/images/google-logo.png"
                  alt="google-logo"
                  width={60}
                  height={20}
                  className="mr-2"
                />
              </div>
              {suggestions.length > 0 ? (
                suggestions.map((suggestion) => (
                  <>
                    <div
                      className="group/suggestion flex cursor-pointer items-center px-3 py-3 hover:bg-gray-100"
                      onClick={() => handleSuggestionClick(suggestion)}
                    >
                      <div className="flex w-full justify-between">
                        <div className="flex items-center">
                          <MapPinIcon className="mb-1 h-4 w-4 shrink-0 text-gray-400" />
                          <li
                            key={suggestion.place_id}
                            className="ml-2 text-sm text-gray-600"
                          >
                            {suggestion.description}
                          </li>
                        </div>
                        <div>
                          <ChevronRightIcon className="invisible h-5 w-5 text-gray-400 group-hover/suggestion:visible" />
                        </div>
                      </div>
                    </div>
                  </>
                ))
              ) : (
                <div className="p-2 text-center text-sm text-gray-500">
                  <p>Keine Ergebnisse gefunden</p>
                </div>
              )}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
