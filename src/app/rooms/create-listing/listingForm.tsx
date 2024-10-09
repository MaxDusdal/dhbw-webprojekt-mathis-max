"use client";
import React, { useCallback, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import QuantitySelector from "../../../components/listings/QuantitySelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { UploadButton, UploadDropzone } from "~/app/utils/uploadthing";
import "@uploadthing/react/styles.css";
import { api } from "~/trpc/react";
import Image from "next/image";
import {
  FileUploaderRegular,
  FileUploaderMinimal,
} from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useLoadScript, Autocomplete } from "@react-google-maps/api";

const vacationHomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  guestCount: z.number().int().min(1, "At least 1 guest is required"),
  bedroomCount: z.number().int().min(1, "At least 1 bedroom is required"),
  bedCount: z.number().int().min(1, "At least 1 bed is required"),
  bathroomCount: z.number().int().min(1, "At least 1 bathroom is required"),
  pricePerNight: z.number().positive("Price must be positive"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  isAvailable: z.boolean(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  houseRules: z.string().optional(),
  cancellationPolicy: z.string().optional(),
  images: z.array(z.string()).optional(),
  amenities: z.array(z.number()).min(1, "At least one amenity is required"),
});

type VacationHomeFormData = z.infer<typeof vacationHomeSchema>;

interface VacationHomeFormProps {
  onSubmit: (data: VacationHomeFormData) => void;
  initialData?: Partial<VacationHomeFormData>;
}

const VacationHomeForm: React.FC<VacationHomeFormProps> = ({
  onSubmit,
  initialData,
}) => {
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ?? "",
    libraries: ["places"],
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useForm<VacationHomeFormData>({
    resolver: zodResolver(vacationHomeSchema),
    defaultValues: initialData || {
      guestCount: 1,
      bedroomCount: 1,
      bedCount: 1,
      bathroomCount: 1,
      isAvailable: true,
      amenities: [],
    },
  });

  const selectedAmenities = watch("amenities");

  const toggleAmenity = useCallback(
    (amenityId: number) => {
      setValue(
        "amenities",
        selectedAmenities.includes(amenityId)
          ? selectedAmenities.filter((id) => id !== amenityId)
          : [...selectedAmenities, amenityId],
        { shouldValidate: true },
      );
    },
    [selectedAmenities, setValue],
  );

  const amenitiesQuery = api.amenities.getAll.useQuery();

  const handlePlaceSelect = (place: google.maps.places.PlaceResult) => {
    setValue("latitude", place.geometry?.location?.lat() || undefined);
    setValue("longitude", place.geometry?.location?.lng() || undefined);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div>
        <label
          htmlFor="title"
          className="block text-sm font-medium text-gray-700"
        >
          Title
        </label>
        <Controller
          name="title"
          control={control}
          render={({ field }) => (
            <Input {...field} id="title" className="mt-1" />
          )}
        />
        {errors.title && (
          <p className="mt-1 text-sm text-red-600">{errors.title.message}</p>
        )}
      </div>
      <div>
        <label
          htmlFor="description"
          className="block text-sm font-medium text-gray-700"
        >
          Beschreibung
        </label>
        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="description" className="mt-1" />
          )}
        />
        {errors.description && (
          <p className="mt-1 text-sm text-red-600">
            {errors.description.message}
          </p>
        )}
      </div>

      <div>
        <label
          htmlFor="pricePerNight"
          className="block text-sm font-medium text-gray-700"
        >
          Preis pro Nacht
        </label>
        <Controller
          name="pricePerNight"
          control={control}
          render={({ field: { onChange, value, ...rest } }) => (
            <Input
              {...rest}
              onChange={(e) => onChange(parseFloat(e.target.value))}
              value={value === undefined ? "" : value}
              id="pricePerNight"
              type="number"
              step="0.01"
              className="mt-1"
            />
          )}
        />
        {errors.pricePerNight && (
          <p className="mt-1 text-sm text-red-600">
            {errors.pricePerNight.message}
          </p>
        )}
      </div>
      <div>
        <label>Allgemein</label>
        <Card>
          <CardContent className="pb-0">
            <Controller
              name="guestCount"
              control={control}
              render={({ field }) => (
                <QuantitySelector
                  label={<span>Gäste</span>}
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
              )}
            />
            {errors.guestCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.guestCount.message}
              </p>
            )}

            <Separator></Separator>
            <Controller
              name="bedroomCount"
              control={control}
              render={({ field }) => (
                <QuantitySelector
                  label={<span>Schlafzimmer</span>}
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
              )}
            />
            {errors.bedroomCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bedroomCount.message}
              </p>
            )}
            <Separator></Separator>
            <Controller
              name="bedCount"
              control={control}
              render={({ field }) => (
                <QuantitySelector
                  label={<span>Betten</span>}
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
              )}
            />
            {errors.bedCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bedCount.message}
              </p>
            )}

            <Separator></Separator>
            <Controller
              name="bathroomCount"
              control={control}
              render={({ field }) => (
                <QuantitySelector
                  label={<span>Badezimmer/WCs</span>}
                  value={field.value}
                  onChange={field.onChange}
                  min={1}
                />
              )}
            />
            {errors.bathroomCount && (
              <p className="mt-1 text-sm text-red-600">
                {errors.bathroomCount.message}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <Separator></Separator>
      {amenitiesQuery.data ? (
        <div>
          <label>Ausstattungsmerkmale</label>
          <div className="mt-3 grid w-full grid-cols-3 gap-5">
            {amenitiesQuery.data.map((amenity) => (
              <div
                key={amenity.id}
                className={`flex cursor-pointer flex-col items-start gap-2 rounded-md p-4 ring-1 ${
                  selectedAmenities.includes(amenity.id)
                    ? "bg-gray-100 ring-2 ring-black"
                    : "ring-gray-300 hover:ring-2 hover:ring-black"
                }`}
                onClick={() => toggleAmenity(amenity.id)}
              >
                <Image
                  src={"/images/" + amenity.icon}
                  alt={amenity.name}
                  width={32}
                  height={32}
                />
                <div>
                  <div>{amenity.name}</div>
                </div>
              </div>
            ))}
          </div>
          {errors.amenities && (
            <p className="mt-1 text-sm text-red-600">
              {errors.amenities.message}
            </p>
          )}
        </div>
      ) : (
        <></>
      )}
      <Separator></Separator>

      {true ? (
        <div>
          <label>Bilder</label>
          <div className="mt-3 grid w-full grid-cols-2 gap-5">
            <Image
              alt="Product image"
              className="aspect-square w-full rounded-md object-cover"
              height="300"
              src="https://ui.shadcn.com/placeholder.svg"
              width="300"
            />
            <div className="flex flex-col space-y-5">
              <div className="grid w-full grid-cols-2 gap-5">
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="https://ui.shadcn.com/placeholder.svg"
                  width="300"
                />
                <Image
                  alt="Product image"
                  className="aspect-square w-full rounded-md object-cover"
                  height="300"
                  src="https://ui.shadcn.com/placeholder.svg"
                  width="300"
                />
              </div>
              <div className="flex h-full w-full flex-grow items-center justify-center rounded-md border border-dashed text-sm">
                <FileUploaderRegular
                  sourceList="local, camera, dropbox, gdrive"
                  classNameUploader="uc-light uc-gray"
                  pubkey="413109ae6155eb8e885e"
                />
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div>
          <FileUploaderMinimal
            classNameUploader="uc-light uc-gray"
            pubkey="413109ae6155eb8e885e"
          />
        </div>
      )}

      <Separator></Separator>
      <div className="flex w-full justify-end">
        <Button className="mt-3 w-full" type="submit">
          Erstellen
        </Button>
      </div>
    </form>
  );
};

export default VacationHomeForm;
