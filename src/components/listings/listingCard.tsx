import { Booking, VacationHome } from "@prisma/client";
import { Separator } from "@radix-ui/react-separator";
import CustomButton from "../Buttons/CustomButton";
import { CardTitle, CardDescription } from "../ui/card";
import Image from "next/image";
import { VacationHomeWithImages } from "~/app/utils/types";
import { Trash2 } from "lucide-react";

type Props = {
  vacationHome: VacationHomeWithImages;
  index: number;
  bookings: Booking[];
};
export default function ListingCard({ vacationHome, bookings, index }: Props) {
  return (
    <div className="grid grid-cols-1">
      <div
        key={vacationHome.id}
        className="my-4 rounded-lg border bg-card p-5 text-card-foreground shadow-sm transition-all duration-300"
      >
        <div className="flex flex-row gap-4">
          <div className="relative h-24 w-24 overflow-hidden rounded-md">
            <Image
              src={vacationHome.images[0]?.url || "/images/placeholder.webp"}
              alt={vacationHome.title}
              fill
              className="object-cover"
            />
          </div>
          <div className="flex flex-col justify-between gap-1">
            <div>
              <p className="text-xs text-gray-500">
                {vacationHome.locationDescription || "Unbekannt"}
              </p>
              <CardTitle className="text-lg">{vacationHome.title}</CardTitle>
              <CardDescription>
                {vacationHome.pricePerNight.toFixed(2)}€ pro Nacht
              </CardDescription>
            </div>
            <p className="text-xs text-gray-500">
              {bookings.length} Buchungen insgesamt |{" "}
              {bookings.filter((booking) => booking.status === "PAID").length}{" "}
              Buchungen offen
            </p>
          </div>
        </div>
        <div className="mt-5 flex justify-between">
          <div className="flex flex-row gap-2">
            <CustomButton
              href={`/account/rooms/${vacationHome.id}`}
              variant="primary"
              fullWidth={false}
            >
              Buchungs Dashboard
            </CustomButton>
            <CustomButton
              href={`/rooms/${vacationHome.id}/edit`}
              variant="tertiary"
              fullWidth={false}
            >
              Bearbeiten
            </CustomButton>
            <CustomButton
              href={`/rooms/${vacationHome.id}`}
              variant="tertiary"
              fullWidth={false}
            >
              Ansehen
            </CustomButton>
          </div>
          <CustomButton className="h-full" variant="tertiary" fullWidth={false}>
            {/*<Trash2 className="h-4"></Trash2>*/ "Löschen"}
          </CustomButton>
        </div>
      </div>
    </div>
  );
}
