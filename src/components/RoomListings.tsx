import React, { useCallback, useEffect, useRef, useState } from "react";
import { useSearchParams } from "next/navigation";
import { api } from "~/trpc/react";
import ListingPageSkeleton, { ListingCoversSectionSkeleton } from "./listings/ListingsPageSkeleton";
import ListingCover from "./listing-cover";

export default function RoomsListings() {
    const [search, setSearch] = useState({
      coordinates: { lat: 0, lng: 0 },
      checkIn: "",
      checkOut: "",
      adults: 0,
      children: 0,
      pets: 0,
    });
    const observerTarget = useRef(null);
    const searchParams = useSearchParams();
    function transformSearchParamsToState() {
      setSearch({
        coordinates: JSON.parse(searchParams.get("coordinates") || "{}"),
        checkIn: searchParams.get("checkIn") || "",
        checkOut: searchParams.get("checkOut") || "",
        adults: parseInt(searchParams.get("adults") || "0"),
        children: parseInt(searchParams.get("children") || "0"),
        pets: parseInt(searchParams.get("pets") || "0"),
      });
    }
  
    useEffect(() => {
      transformSearchParamsToState();
    }, [searchParams]);
  
    const listings = api.vacationhome.findMany.useInfiniteQuery(
      { limit: 20, ...search },
      {
        getNextPageParam: (lastPage) => lastPage.nextCursor,
      },
    );
  
    const { data, fetchNextPage, hasNextPage, isFetching, isFetchingNextPage } =
      listings;
  
    const handleObserver = useCallback(
      (entries: IntersectionObserverEntry[]) => {
        const [entry] = entries;
        if (entry && entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      [hasNextPage, isFetchingNextPage, fetchNextPage],
    );
  
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
      <>
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 max-sm:px-2 max-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {data?.pages.map((page) => {
            return page.vacationHomes.map((vacationHome: any) => {
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
      </>
    );
  }
  