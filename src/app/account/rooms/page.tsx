"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardTitle,
} from "~/components/ui/card";
import Image from "next/image";
import { api } from "~/trpc/react";
import Link from "next/link";
import CustomButton from "~/components/Buttons/CustomButton";
import MainContainer from "~/components/Utility/MainContainer";
import NarrowContainer from "~/components/Utility/NarrowContainer";
import { Separator } from "~/components/ui/separator";

export default function RoomsPage() {
  const vacationHomes = api.vacationhome.getVacationHomesByUser.useQuery();
  return (
    <main>
      <NarrowContainer>
        {vacationHomes.data?.map((vacationHome, index) => (
          <>
            <div
              key={vacationHome.id}
              className="my-4 p-5 transition-all duration-300"
            >
              <div className="flex flex-row gap-4">
                <div className="relative h-24 w-24 overflow-hidden rounded-md">
                  <Image
                    src={
                      vacationHome.images[0]?.url || "/images/placeholder.webp"
                    }
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
                    <CardTitle className="text-lg">
                      {vacationHome.title}
                    </CardTitle>
                    <CardDescription>
                      {vacationHome.pricePerNight.toFixed(2)}€ pro Nacht
                    </CardDescription>
                  </div>
                  <p className="text-xs text-gray-500">
                    {vacationHome.bookings.length} Buchungen insgesamt |{" "}
                    {
                      vacationHome.bookings.filter(
                        (booking) => booking.status === "PAID",
                      ).length
                    }{" "}
                    Buchungen offen
                  </p>
                </div>
              </div>
              <div className="mt-4 flex flex-row gap-2">
                <CustomButton
                  href={`/rooms/${vacationHome.id}#bookings`}
                  variant="primary"
                  fullWidth={false}
                >
                  Buchungen
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
            </div>
            {index < vacationHomes.data?.length - 1 && <Separator />}
          </>
        ))}
      </NarrowContainer>
    </main>
  );
}
