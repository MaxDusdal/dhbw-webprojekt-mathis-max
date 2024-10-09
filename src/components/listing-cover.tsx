import Image from "next/image";
import Link from "next/link";
import { Suspense } from "react";
import { Skeleton } from "./ui/skeleton";
import { useSearchParams } from "next/navigation";

interface Props {
  listing_id: string;
  image_url: string;
  location: string;
  price: number;
}

function ListingImage({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative aspect-square w-full">
      <Image
        src={src}
        alt={alt}
        layout="fill"
        objectFit="cover"
        className="rounded-xl"
      />
    </div>
  );
}

export default function ListingCover(props: Props) {
  const searchParams = useSearchParams();
  const currentParams = new URLSearchParams(searchParams.toString());
  const newPath = `/rooms/${props.listing_id}?${currentParams.toString()}`;

  return (
    <Link href={newPath}>
      <div className="flex flex-col justify-start">
        <Suspense
          fallback={<Skeleton className="aspect-square w-full rounded-xl" />}
        >
          <ListingImage
            src={props.image_url}
            alt={`Bild von ${props.location}`}
          />
        </Suspense>
        <div className="mt-1">
          <p className="font-normal">{props.location}</p>
          <p className="font-light">
            <span className="font-normal">{props.price}€</span> Nacht
          </p>
        </div>
      </div>
    </Link>
  );
}
