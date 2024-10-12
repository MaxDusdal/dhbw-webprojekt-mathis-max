"use client";

import ListingSearch from "~/components/ListingSearch";
import ListingCover from "~/components/listing-cover";
import { api } from "~/trpc/react";
import ListingPageSkeleton, {
  ListingCoverSkeleton,
  ListingCoversSectionSkeleton,
} from "~/components/listings/ListingsPageSkeleton";
import React from "react";
import CustomButton from "~/components/Buttons/CustomButton";
import { Button } from "~/components/ui/button";
import { useEffect, useRef, useCallback } from 'react';

export default function Rooms() {
  const observerTarget = useRef(null);

  const listings = api.vacationhome.findMany.useInfiniteQuery(
    { limit: 20 },
    {
      getNextPageParam: (lastPage) => lastPage.nextCursor,
    },
  );

  const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
    listings;

  const handleObserver = useCallback((entries: IntersectionObserverEntry[]) => {
    const [entry] = entries;
    if (entry && entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  useEffect(() => {
    const element = observerTarget.current;
    if (!element) return;

    const option = {
      threshold: 0,
    };

    const observer = new IntersectionObserver(handleObserver, option);
    observer.observe(element);

    return () => observer.disconnect();
  }, [handleObserver]);


  if ((isFetching && !listings.data) || !listings.data) {
    return <ListingPageSkeleton></ListingPageSkeleton>;
  }
  return (
    <div className="max-sm:px-1">
      <div className="flex w-full justify-center">
        <ListingSearch></ListingSearch>
      </div>
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 max-sm:px-2 max-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {data?.pages.map((page) => {
          return page.vacationHomes.map((vacationHome) => {
            return (
              <ListingCover
                key={vacationHome.id}
                listing={vacationHome}
              ></ListingCover>
            );
          });
        })}
      </div>
      {isFetching && listings.data ? (
        <ListingCoversSectionSkeleton></ListingCoversSectionSkeleton>
      ) : (
        <></>
      )}

      {(isFetching || isFetchingNextPage) && <div>Loading more...</div>}
      <div ref={observerTarget} style={{ height: "1px" }} />
    </div>
  );
}
