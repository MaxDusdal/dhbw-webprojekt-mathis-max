"use client";

import ListingCover from "~/components/listing-cover";
import { api } from "~/trpc/react";

export default function Rooms() {
  const listings = api.vacationhome.findMany.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } = listings;

  if (isFetching) {
    return <div>Loading...</div>;
  }
  return (
    <div className="grid grid-cols-4 gap-x-6 gap-y-10">
      {data?.pages.map((page) => {
        return page.vacationHomes.map((vacationHome) => {
          return (
            <ListingCover
              key={vacationHome.id}
              price={vacationHome.pricePerNight}
              image_url={vacationHome.images[0]?.url ?? ""}
              location={vacationHome.location}
              listing_id={vacationHome.id.toString()}
            ></ListingCover>
          );
        });
      })}
      {/*mockListings.map((data) => {
        return (
          <ListingCover
            key={data.listing_id}
            price={data.price}
            image_url={data.image_url}
            location={data.location}
            listing_id={data.listing_id}
          ></ListingCover>
        );
      }) */}

      <button onClick={() => fetchNextPage()}>Load More</button>
    </div>
  );
}
