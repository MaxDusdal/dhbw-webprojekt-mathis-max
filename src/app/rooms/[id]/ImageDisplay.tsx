import Image from "next/image";
import { useState, useMemo } from "react";
import { Skeleton } from "~/components/ui/skeleton";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "~/components/ui/carousel";
import { Dialog, DialogContent } from "~/components/ui/dialog";
import { useEffect } from "react";

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

  const displayImages = useMemo(
    () => image_urls?.slice(0, 5) || [],
    [image_urls],
  );
  const remainingSkeletons = useMemo(
    () => 5 - displayImages.length,
    [displayImages],
  );

  if (!image_urls || image_urls.length === 0) {
    return (
      <div className="mt-6 grid h-[516px] w-full grid-cols-2 gap-2 overflow-hidden rounded-2xl">
        <Skeleton className="h-full w-full" />
        <div className="grid h-full w-full grid-cols-2 gap-2">
          {[...Array(4)].map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="h-full w-full" />
          ))}
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
        {displayImages[0] && (
          <ImageTile
            image={displayImages[0]}
            onClick={() => handleImageClick(0)}
          />
        )}
        <div className="grid h-full w-full grid-cols-2 gap-2">
          {displayImages.slice(1).map((image, index) => (
            <ImageTile
              key={image.id}
              image={image}
              onClick={() => handleImageClick(index + 1)}
            />
          ))}
          {[...Array(remainingSkeletons)].map((_, index) => (
            <Skeleton key={`skeleton-${index}`} className="h-full w-full" />
          ))}
        </div>
      </div>
      <ImageCarousel
        images={image_urls}
        isOpen={isCarouselOpen}
        onOpenChange={setIsCarouselOpen}
        selectedIndex={selectedImageIndex}
        onSelectImage={setSelectedImageIndex}
      />
    </>
  );
}

type ImageTileProps = {
  image: ImageData;
  onClick: () => void;
};

function ImageTile({ image, onClick }: ImageTileProps) {
  return (
    <div className="relative h-full w-full cursor-pointer" onClick={onClick}>
      <Image
        src={image.url}
        alt={`Vacation home image ${image.id}`}
        layout="fill"
        objectFit="cover"
      />
    </div>
  );
}

type ImageCarouselProps = {
  images: ImageData[];
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
  selectedIndex: number;
  onSelectImage: (index: number) => void;
};

function ImageCarousel({
  images,
  isOpen,
  onOpenChange,
  selectedIndex,
  onSelectImage,
}: ImageCarouselProps) {
  const [api, setApi] = useState<any>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) {
      return;
    }

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  useEffect(() => {
    api?.scrollTo(selectedIndex);
  }, [api, selectedIndex]);

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-full max-w-[90vw] border-none border-opacity-0 bg-transparent bg-opacity-0 px-0 py-10">
        <Carousel
          setApi={setApi}
          className="h-full w-full"
          opts={{ loop: true }}
        >
          <CarouselContent>
            {images.map((image) => (
              <CarouselItem key={image.id}>
                <div className="felx relative h-[calc(90vh-88px)] w-full flex-grow">
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
        <div className="mt-4 flex justify-center space-x-2 overflow-x-auto p-2">
          {images.map((image, index) => (
            <button
              key={image.id}
              onClick={() => onSelectImage(index)}
              className={`relative h-16 w-16 overflow-hidden rounded-md transition-all ${
                index === current ? "ring-2 ring-white" : ""
              }`}
            >
              <Image
                src={image.url}
                alt={`Thumbnail ${index + 1}`}
                layout="fill"
                objectFit="cover"
              />
            </button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
