import React from "react";
import { Skeleton } from "~/components/ui/skeleton";

export function ListingSearchSkeleton() {
  //return <></>;
  return (
    <div className="mb-8 flex w-fit items-center rounded-full p-0 shadow-lg ring-1 ring-gray-300">
      <Skeleton className="h-16 w-48 rounded-l-full" />
      <Skeleton className="h-16 w-48" />
      <Skeleton className="h-16 w-48" />
      <Skeleton className="h-16 w-48 rounded-r-full" />
    </div>
  );
}

export function ListingCoverSkeleton() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-64 w-full rounded-lg" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  );
}

export function ListingCoversSectionSkeleton() {
  return (
    <div className="grid grid-cols-1 gap-x-6 gap-y-10 max-sm:px-2 max-[480px]:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(8)].map((_, index) => (
        <ListingCoverSkeleton key={index} />
      ))}
    </div>
  );
}

export default function ListingPageSkeleton() {
  return (
    <>
      <ListingCoversSectionSkeleton></ListingCoversSectionSkeleton>
      <div className="mt-6 flex justify-center">
        <Skeleton className="h-10 w-32 rounded-full" />
      </div>
    </>
  );
}
