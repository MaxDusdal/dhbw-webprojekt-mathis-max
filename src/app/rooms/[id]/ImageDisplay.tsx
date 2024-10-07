import Image from "next/image";
import { useState } from "react";
import { X } from "lucide-react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Dialog, DialogContent } from "~/components/ui/dialog";

type ImageData = {
  id: number;
  url: string;
  vacationHomeId: number;
  createdAt: Date;
  updatedAt: Date;
};

type Props = {
  image_urls: ImageData[] | undefined;
};

export default function ImageDisplay({ image_urls }: Props) {
  const [isCarouselOpen, setIsCarouselOpen] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  if (!image_urls || image_urls.length === 0) {
    return (
      <div className="mt-6 grid h-[516px] w-full grid-cols-2 gap-2 overflow-hidden rounded-2xl">
        <Skeleton className="h-full w-full" />
        <div className="grid h-full w-full grid-cols-2 gap-2">
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
          <Skeleton className="h-full w-full" />
        </div>
      </div>
    );
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index);
    setIsCarouselOpen(true);
  };

  return (
    <>
      <div className="mt-6 grid h-[516px] w-full grid-cols-2 gap-2 overflow-hidden rounded-2xl">
        <div
          className="relative h-full w-full cursor-pointer"
          onClick={() => handleImageClick(0)}
        >
          <Image
            src={image_urls[0].url}
            alt={`Vacation home image ${image_urls[0].id}`}
            layout="fill"
            objectFit="cover"
          />
        </div>
        <div className="grid h-full w-full grid-cols-2 gap-2">
          {image_urls.slice(1, 5).map((image, index) => (
            <div
              key={image.id}
              className="relative h-full w-full cursor-pointer"
              onClick={() => handleImageClick(index + 1)}
            >
              <Image
                src={image.url}
                alt={`Vacation home image ${image.id}`}
                layout="fill"
                objectFit="cover"
              />
            </div>
          ))}
          {[...Array(4 - Math.min(image_urls.length - 1, 4))].map(
            (_, index) => (
              <Skeleton key={`skeleton-${index}`} className="h-full w-full" />
            ),
          )}
        </div>
      </div>

      <Dialog open={isCarouselOpen} onOpenChange={setIsCarouselOpen}>
        <DialogContent className="max-h-[90vh] max-w-[90vw]">
          <Carousel className="w-full">
            <CarouselContent>
              {image_urls.map((image, index) => (
                <CarouselItem key={image.id}>
                  <div className="relative aspect-video w-full">
                    <Image
                      src={image.url}
                      alt={`Vacation home image ${image.id}`}
                      layout="fill"
                      objectFit="contain"
                    />
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious />
            <CarouselNext />
          </Carousel>
          <button
            className="absolute right-4 top-4 rounded-full bg-black bg-opacity-50 p-2 text-white"
            onClick={() => setIsCarouselOpen(false)}
          >
            <X size={24} />
          </button>
        </DialogContent>
      </Dialog>
    </>
  );
}
