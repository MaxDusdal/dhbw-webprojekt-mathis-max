import { ChevronRightIcon, MapPinIcon } from "@heroicons/react/24/outline";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import type { PlaceSuggestion } from "~/app/utils/types";

export default function SuggestionEntry({
  suggestion,
  handleSuggestionClick,
}: {
  suggestion: PlaceSuggestion | null;
  handleSuggestionClick: (suggestion: PlaceSuggestion) => void;
}) {
  return (
    <div
      className="group/suggestion flex cursor-pointer items-center px-3 py-3 hover:bg-gray-100"
      onClick={() => {
        if (suggestion) {
          handleSuggestionClick(suggestion);
        }
      }}
    >
      <div className="flex w-full justify-between">
        <div className="flex items-center">
          <MapPinIcon className="mb-1 h-4 w-4 shrink-0 text-gray-400" />
          {suggestion ? (
            <li key={suggestion.place_id} className="ml-2 text-sm text-gray-600">
              {suggestion.description}
            </li>
          ) : (
            <Skeleton height={20} width={200} className="ml-2" />
          )}
        </div>
        <div>
          <ChevronRightIcon className="invisible h-5 w-5 text-gray-400 group-hover/suggestion:visible" />
        </div>
      </div>
    </div>
  );
}
