import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { useSearchParams } from "next/navigation";
import { VacationHome } from "@prisma/client";
import { VacationHomeWithImages } from "~/app/utils/types";

interface Props {
  listing_id: string;
  image_url: string;
  location: string;
  price: number;
}

function ListingImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square w-full overflow-hidden">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
        className="rounded-xl object-cover"
      />
    </div>
  );
}

export default function ListingCover({
  listing,
}: {
  listing: VacationHomeWithImages;
}) {
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  console.log(listing.id);
  const newPath = `/rooms/${listing.id}?${currentParams.toString()}`;
  console.log(listing.images[0]?.url);

  return (
    <Link href={newPath}>
      <div className="flex flex-col justify-start">
        <Suspense
          fallback={<Skeleton className="aspect-square w-full rounded-xl" />}
        >
          <ListingImage
            src={listing.images[0]?.url || "/images/placeholder.webp"}
            alt={`Bild von ${listing.title}`}
          />
        </Suspense>
        <div className="mt-1">
          <p className="text-base font-normal">{listing.title}</p>
          <p className="text-sm font-light text-gray-500">
            <span className="font-normal">
              {listing.pricePerNight.toFixed(2)}€{" "}
            </span>
            Nacht
          </p>
        </div>
      </div>
    </Link>
  );
}
