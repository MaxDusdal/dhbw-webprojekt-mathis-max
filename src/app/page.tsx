"use client";

import ListingSearch from "~/components/ListingSearch";
import ListingCover from "~/components/listing-cover";
import { api } from "~/trpc/react";
import ListingPageSkeleton, {
  ListingCoverSkeleton,
} from "~/components/listings/ListingsPageSkeleton";
import React from "react";
import CustomButton from "~/components/Buttons/CustomButton";
import { Button } from "~/components/ui/button";

export default function Rooms() {
  const listings = api.vacationhome.findMany.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    listings;

  if ((isFetching && !listings.data) || !listings.data) {
    return <ListingPageSkeleton></ListingPageSkeleton>;
  }
  return (
    <>
      <div className="flex w-full justify-center">
        <ListingSearch></ListingSearch>
      </div>
      <div className="grid grid-cols-4 gap-x-6 gap-y-10">
        {data?.pages.map((page) => {
          return page.vacationHomes.map((vacationHome) => {
            return (
              <ListingCover
                key={vacationHome.id}
                price={vacationHome.pricePerNight}
                image_url={vacationHome.images[0]?.url ?? ""}
                location={vacationHome.locationDescription || "Unknown"}
                listing_id={vacationHome.id.toString()}
              ></ListingCover>
            );
          });
        })}
      </div>
      {isFetching && listings.data ? (
        <div className="grid grid-cols-4 gap-x-6 gap-y-10">
          {[...Array(8)].map((_, index) => (
            <ListingCoverSkeleton key={index} />
          ))}
        </div>
      ) : (
        <></>
      )}
      <div className="mt-6 flex w-full justify-center">
        <Button
          className="h-10 w-32 rounded-full bg-transparent font-medium text-black ring-1 ring-gray-300 hover:bg-gray-100"
          onClick={() => fetchNextPage()}
        >
          Load More
        </Button>
      </div>
    </>
  );
}
