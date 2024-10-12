"use client";
import { api } from "~/trpc/react";

import MainContainer from "~/components/Utility/MainContainer";
import ListingCard from "~/components/listings/listingCard";
import { Skeleton } from "~/components/ui/skeleton";
import NarrowContainer from "~/components/Utility/NarrowContainer";

export default function RoomsPage() {
  const vacationHomes = api.vacationhome.getVacationHomesByUser.useQuery();

  if (vacationHomes.isLoading) {
    return RoomsPageSkeleton();
  }

  return (
    <main>
      <NarrowContainer>
        {vacationHomes.data?.map((vacationHome, index) => (
          <div className="grid grid-cols-1 gap-4">
            <ListingCard
              vacationHome={vacationHome}
              index={index}
              bookings={vacationHome.bookings}
            ></ListingCard>
          </div>
        ))}
      </NarrowContainer>
    </main>
  );
}

function RoomsPageSkeleton() {
  return (
    <main>
      <NarrowContainer>
        <div className="grid grid-cols-1 gap-4">
          {[...Array(4)].map((_, index) => (
            <div key={index} className="my-4 rounded-lg border p-5 shadow-sm">
              <div className="flex flex-row gap-4">
                <Skeleton className="h-24 w-24 rounded-md" />
                <div className="flex flex-1 flex-col justify-between gap-1">
                  <div>
                    <Skeleton className="mb-2 h-4 w-1/4" />
                    <Skeleton className="mb-2 h-6 w-3/4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                  <Skeleton className="h-4 w-2/3" />
                </div>
              </div>
              <div className="mt-4 flex flex-row gap-2">
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
                <Skeleton className="h-10 w-24" />
              </div>
            </div>
          ))}
        </div>
      </NarrowContainer>
    </main>
  );
}
