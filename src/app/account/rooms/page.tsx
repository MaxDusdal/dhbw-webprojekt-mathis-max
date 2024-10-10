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

export default function RoomsPage() {
  const vacationHomes = api.vacationhome.getVacationHomesByUser.useQuery();
  return (
    <main>
      <h1>Meine Unterkünfte</h1>
      {vacationHomes.data?.map((vacationHome, index) => (
        <Card
          key={vacationHome.id}
          className="mb-4 p-5 shadow-md transition-all duration-300 hover:shadow-xl"
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
            <div>
              <p className="text-xs text-gray-500">
                {vacationHome.locationDescription || "Unbekannt"}
              </p>
              <CardTitle className="text-lg">{vacationHome.title}</CardTitle>
              <CardDescription>
                Preis pro Nacht: {vacationHome.pricePerNight},00€
              </CardDescription>
              <div className="flex flex-row gap-2 mt-4">
                <CustomButton
                  href={`/rooms/${vacationHome.id}`}
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
          </div>
        </Card>
      ))}
    </main>
  );
}
