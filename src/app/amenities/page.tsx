"use client";
import { api, TRPCReactProvider } from "~/trpc/react";
import NarrowContainer from "~/components/Utility/NarrowContainer";
import Image from "next/image";

function AmenitiesPage() {
  const amenitiesQuery = api.amenities.getAll.useQuery();

  if (!amenitiesQuery.data) return null;
  return (
    <TRPCReactProvider>
      <NarrowContainer>
        <h1>Amenities</h1>
        {amenitiesQuery.data.map((amenity) => (
          <>
            <div className="hover: mb-6 flex items-center gap-2 rounded-md bg-gray-50 p-2 ring-1 ring-gray-300 hover:ring-gray-400">
              <Image
                src={"/images/" + amenity.icon}
                alt={amenity.name}
                width={32}
                height={32}
              />
              <div>
                <div key={amenity.id}>{amenity.name}</div>
              </div>
            </div>
          </>
        ))}
      </NarrowContainer>
    </TRPCReactProvider>
  );
}

export default AmenitiesPage;
