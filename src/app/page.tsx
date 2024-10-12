"use client";

import ListingSearch from "~/components/ListingSearch";
import ListingCover from "~/components/listing-cover";
import { api } from "~/trpc/react";
import ListingPageSkeleton, {
  ListingCoverSkeleton,
  ListingCoversSectionSkeleton,
} from "~/components/listings/ListingsPageSkeleton";
import React, { Suspense, useState } from "react";
import CustomButton from "~/components/Buttons/CustomButton";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useRouter } from "next/navigation";
import RoomsListings from "~/components/RoomListings";


export default function Rooms() {
  const router = useRouter();

  return (
    <div className="max-sm:px-1">
      <div className="flex w-full justify-center">
        <ListingSearch></ListingSearch>
      </div>
      <div className="mb-4 flex justify-center py-2">
        <button
          className="text-xs text-gray-500"
          onClick={() => router.push("/")}
        >
          Alle Filter löschen
        </button>
      </div>
      <Suspense fallback={<ListingPageSkeleton></ListingPageSkeleton>}>
        <RoomsListings></RoomsListings>
      </Suspense>
    </div>
  );
}
