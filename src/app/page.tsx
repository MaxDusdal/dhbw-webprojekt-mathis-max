"use client";

import ListingSearch from "~/components/ListingSearch";
import ListingCover from "~/components/listing-cover";
import { api } from "~/trpc/react";
import ListingPageSkeleton from "~/components/listings/ListingsPageSkeleton";
import React from "react";

export default function Rooms() {
  const listings = api.vacationhome.findMany.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    listings;

  if (isFetching || !listings.data) {
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
        <button onClick={() => fetchNextPage()}>Load More</button>
      </div>
    </>
  );
}
