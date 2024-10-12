import Image from "next/image";
import { round } from "lodash";
import { format, differenceInCalendarDays } from "date-fns";
import { Separator } from "~/components/ui/separator";
import { addToRange, type DateRange } from "react-day-picker";
import { de } from "date-fns/locale";
import { useParams, useSearchParams } from "next/navigation";
import ReservationDataInput from "~/components/listings/ReservationDataInput";
import { api } from "~/trpc/react";

type Guests = {
  adults: number;
  children: number;
  pets: number;
};

type CoverData = {
  image_url: string;
  title: string;
  description: string;
};

type ReservationData = {
  coverData: CoverData;
  dateRange: DateRange | undefined;
  handleSelectCheckIn: (date: Date | undefined) => void;
  handleSelectCheckOut: (date: Date | undefined) => void;
  guests: Guests;
  handleChange: (type: keyof Guests) => (value: number) => void;
  price_per_night: number;
};

export default function ReservationBookingOverview({
  dateRange,
  handleSelectCheckIn,
  handleSelectCheckOut,
  guests,
  handleChange,
  coverData,
  price_per_night,
}: ReservationData) {
  const searchParams = useSearchParams();
  const getUpdatedParams = () => {
    const params = new URLSearchParams();
    if (dateRange?.from)
      params.set("from", format(dateRange.from, "dd.MM.yyyy", { locale: de }));
    if (dateRange?.to)
      params.set("to", format(dateRange.to, "dd.MM.yyyy", { locale: de }));
    params.set("adults", guests.adults.toString());
    params.set("children", guests.children.toString());
    params.set("pets", guests.pets.toString());
    return params;
  };

  return (
    <div className="rounded-lg p-6 ring-1 ring-gray-300 hover:shadow-lg">
      <div className="flex w-full items-center space-x-2">
        <div className="flex h-fit w-fit overflow-hidden rounded-lg">
          <Image
            src={coverData.image_url}
            alt="cover"
            width={90}
            height={90}
          ></Image>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-medium">{coverData.title}</p>
          <p className="text-sm font-light">{coverData.description}</p>
          <div className="h-5"></div>
        </div>
      </div>
      <ReservationDataInput
        dateRange={dateRange}
        guests={guests}
        handleChange={handleChange}
        handleSelectCheckIn={handleSelectCheckIn}
        handleSelectCheckOut={handleSelectCheckOut}
      ></ReservationDataInput>
      <div className="mt-5 flex w-full flex-col space-y-4">
        <ReservationOverview
          dateRange={dateRange}
          price_per_night={round(price_per_night)}
        ></ReservationOverview>
      </div>
    </div>
  );
}

type OverviewProps = {
  dateRange: DateRange | undefined;
  price_per_night: number;
};
function ReservationOverview({ dateRange, price_per_night }: OverviewProps) {
  if (!dateRange?.from || !dateRange.to) {
    return <></>;
  }

  const differenceInDays = differenceInCalendarDays(
    dateRange.to,
    dateRange.from,
  );
  return (
    <>
      <Separator></Separator>
      <div className="flex w-full flex-col space-y-4 font-light">
        <p className="w-full font-medium">Einzeiheiten zum Preis:</p>
        <div className="flex w-full justify-between">
          <p className="w-full">
            {price_per_night + "€ x " + differenceInDays + " Nächte"}
          </p>
          <p className="w-fit">{price_per_night * differenceInDays + "€"}</p>
        </div>
        <div className="flex w-full justify-between">
          <p className="w-full">Luftnbn-Servicegebühr</p>
          <p className="w-fit">
            {10 + round((price_per_night * differenceInDays) / 10) + "€"}
          </p>
        </div>
        <Separator></Separator>
        <div className="flex w-full justify-between">
          <p className="w-full font-medium">Gesamtbetrag</p>
          <p className="w-fit font-medium">
            {price_per_night * differenceInDays +
              10 +
              round((price_per_night * differenceInDays) / 10) +
              "€"}
          </p>
        </div>
      </div>
    </>
  );
}
