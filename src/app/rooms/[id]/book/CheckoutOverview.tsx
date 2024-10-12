import { DateRange } from "react-day-picker";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import ReservationDataInput from "~/components/listings/ReservationDataInput";
import { Separator } from "~/components/ui/separator";
import { differenceInCalendarDays } from "date-fns";
import { round } from "lodash";

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
  maxGuests: number;
  handleChange: (type: keyof Guests) => (value: number) => void;
  price_per_night: number;
  booked?: DateRange[];
};
export default function CheckoutOverview({
  dateRange,
  handleSelectCheckIn,
  handleSelectCheckOut,
  guests,
  maxGuests,
  handleChange,
  coverData,
  price_per_night,
  booked,
}: ReservationData) {
  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row justify-between space-x-4 pb-0 max-[425px]:space-x-2 max-[425px]:px-2">
        <div className="flex flex-col">
          <CardTitle>Buchungsübersicht</CardTitle>
          <CardDescription className="h-10">
            Überprüfe alle Angaben und korrigiere diese falls nötig
          </CardDescription>
          <ReservationDataInput
            booked={booked}
            maxGuests={maxGuests}
            dateRange={dateRange}
            guests={guests}
            handleChange={handleChange}
            handleSelectCheckIn={handleSelectCheckIn}
            handleSelectCheckOut={handleSelectCheckOut}
          ></ReservationDataInput>
        </div>
        <div className="flex w-fit flex-col items-end justify-end space-x-2 max-[325px]:justify-start">
          <div className="flex h-fit max-h-[195px] w-fit max-w-[195px] flex-shrink-0 overflow-hidden rounded-lg max-[597px]:h-[110px] max-[597px]:w-[110px] min-[965px]:max-xl:h-[110px] min-[965px]:max-xl:w-[110px] xl:h-[195px] xl:w-[195px]">
            <Image
              className="h-fit w-fit"
              src={coverData.image_url}
              alt="cover"
              width={195}
              height={195}
            ></Image>
          </div>
        </div>
      </CardHeader>
      <CardContent className="max-[425px]:px-2">
        <div className="mt-5 flex w-full flex-col space-y-4">
          <ReservationOverview
            dateRange={dateRange}
            price_per_night={round(price_per_night)}
          ></ReservationOverview>
        </div>
      </CardContent>
    </Card>
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
