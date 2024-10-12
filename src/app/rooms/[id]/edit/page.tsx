"use client";
import { Separator } from "@radix-ui/react-separator";
import { Card, CardHeader, CardTitle, CardContent } from "~/components/ui/card";

export default function EditBooking() {
  return (
    <div className="flex w-full justify-center">
      <Card className="w-[630px]">
        <CardHeader>
          <CardTitle>Unterkunft erstellen</CardTitle>
          <Separator></Separator>
        </CardHeader>
        <CardContent>
          <VacationHomeForm></VacationHomeForm>
        </CardContent>
      </Card>
    </div>
  );
}

import React, { useCallback, useEffect, useState } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import QuantitySelector from "~/components/listings/QuantitySelector";
import "@uploadthing/react/styles.css";
import { api } from "~/trpc/react";
import Image from "next/image";
import {
  FileUploaderRegular,
  FileUploaderMinimal,
} from "@uploadcare/react-uploader/next";
import "@uploadcare/react-uploader/core.css";
import { useLoadScript } from "@react-google-maps/api";
import InputFieldWrapper from "~/components/Inputs/InputFieldWrapper";
import InputField from "~/components/Inputs/InputField";
import {
  vacationhomeCreateSchema,
  vacationhomeUpdateSchema,
} from "~/app/utils/zod";
import AdressAutoComplete from "~/components/Inputs/AdressAutoComplete";
import { notify } from "~/app/utils/notification";
import MultiPictureUpload from "~/components/Inputs/MultiPictureUpload";
import type { ImagesUploadCare } from "~/app/utils/types";
import { redirect, useParams } from "next/navigation";
interface AdressAutoCompleteReturn {
  latitude: number;
  longitude: number;
  locationDescription: string;
}

const quantityFields = [
  { name: "guestCount", label: "Gäste" },
  { name: "bedroomCount", label: "Schlafzimmer" },
  { name: "bedCount", label: "Betten" },
  { name: "bathroomCount", label: "Badezimmer/WCs" },
] as const;

type VacationHomeFormData = z.infer<typeof vacationhomeUpdateSchema>;

const VacationHomeForm = () => {
  const { id } = useParams();
  if (!id || isNaN(Number(id))) {
    return "Kein Listing Kefunden";
  }
  const listingQuery = api.vacationhome.getById.useQuery({ id: Number(id) });

  const [images, setImages] = React.useState<ImagesUploadCare[]>([]);
  const [adressAutoCompleteReturn, setAdressAutoCompleteReturn] =
    React.useState<AdressAutoCompleteReturn>();
  const [updateSuccess, setUpdateSuccess] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
    reset,
  } = useForm<VacationHomeFormData>({
    resolver: zodResolver(vacationhomeUpdateSchema),
    defaultValues: {
      id: Number(id),
      guestCount: 1,
      bedroomCount: 1,
      bedCount: 1,
      bathroomCount: 1,
      isAvailable: true,
      amenities: [],
    },
  });

  useEffect(() => {
    if (listingQuery.data) {
      reset({
        id: listingQuery.data.id,
        title: listingQuery.data.title,
        description: listingQuery.data.description,
        pricePerNight: listingQuery.data.pricePerNight,
        guestCount: listingQuery.data.guestCount,
        bedroomCount: listingQuery.data.bedroomCount,
        bedCount: listingQuery.data.bedCount,
        bathroomCount: listingQuery.data.bathroomCount,
        latitude: listingQuery.data.latitude || undefined,
        longitude: listingQuery.data.longitude || undefined,
        locationDescription: listingQuery.data.locationDescription || undefined,
        amenities: listingQuery.data.amenities.map((a) => a.id),
        images: listingQuery.data.images.map((img) => img.url),
        // Füge hier weitere Felder hinzu
      });
      const convertedImages: ImagesUploadCare[] = listingQuery.data.images.map(
        (img) => ({
          uuid: `temp-${img.id}`, // Verwende eine temporäre UUID
          url: img.url,
          // Füge hier weitere erforderliche Eigenschaften hinzu
        }),
      );
      setImages(convertedImages);
    }
  }, [listingQuery.data, reset]);

  const mutation = api.vacationhome.update.useMutation({
    onSuccess: () => {
      notify.success("Inserat erfolgreich aktualisiert");
      setUpdateSuccess(true);
    },
    onError: (error) => {
      notify.error("Fehler beim Aktualisieren des Inserats");
      console.error(error);
    },
  });

  function onSubmit(data: VacationHomeFormData) {
    mutation.mutate(data);
  }

  useEffect(() => {
    if (updateSuccess) {
      redirect("/account/rooms");
    }
  }, [updateSuccess]);

  const selectedAmenities = watch("amenities");

  const toggleAmenity = useCallback(
    (amenityId: number) => {
      setValue(
        "amenities",
        selectedAmenities?.includes(amenityId)
          ? selectedAmenities?.filter((id) => id !== amenityId)
          : [...(selectedAmenities || []), amenityId],
        { shouldValidate: true },
      );
    },
    [selectedAmenities, setValue],
  );

  const amenitiesQuery = api.amenities.getAll.useQuery();

  useEffect(() => {
    if (images.length > 0) {
      setValue(
        "images",
        images.map((image) => image.url),
      );
    }
  }, [images]);

  useEffect(() => {
    if (adressAutoCompleteReturn) {
      handlePlaceSelect(adressAutoCompleteReturn);
    }
  }, [adressAutoCompleteReturn]);

  const handlePlaceSelect = (place: AdressAutoCompleteReturn) => {
    setValue("latitude", place.latitude);
    setValue("longitude", place.longitude);
    setValue("locationDescription", place.locationDescription);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <InputFieldWrapper id="title" label="Name Ihres Inserats">
        <InputField
          name="title"
          id="title"
          register={register}
          error={errors.title as FieldError}
        ></InputField>
      </InputFieldWrapper>
      <InputFieldWrapper id="description" label="Beschreibung">
        <InputField
          name="description"
          id="description"
          type="textarea"
          resizable
          register={register}
          error={errors.description as FieldError}
        ></InputField>
      </InputFieldWrapper>
      {/* TODO: Add currency selector */}
      <InputFieldWrapper id="locationDescription" label="Adresse">
        <AdressAutoComplete
          description="Adresse"
          setAdressAutoCompleteReturn={setAdressAutoCompleteReturn}
        />
      </InputFieldWrapper>
      <InputFieldWrapper id="pricePerNight" label="Preis pro Nacht">
        <InputField
          name="pricePerNight"
          id="pricePerNight"
          type="number"
          register={register}
          error={errors.pricePerNight as FieldError}
        ></InputField>
      </InputFieldWrapper>
      <InputFieldWrapper id="quantityFields" label="Quantitäten">
        {quantityFields.map((field, index) => (
          <>
            <Controller
              name={field.name}
              control={control}
              key={field.name}
              render={({ field: { onChange, value } }) => (
                <QuantitySelector
                  label={<span>{field.label}</span>}
                  value={value ? value : 0}
                  onChange={onChange}
                  min={1}
                />
              )}
            />
            {errors[field.name] && (
              <p className="mt-1 text-sm text-red-600">
                {errors[field.name]?.message}
              </p>
            )}
            {index < quantityFields.length - 1 && <Separator />}
          </>
        ))}
      </InputFieldWrapper>
      <Separator></Separator>
      {amenitiesQuery.data ? (
        <div>
          <label>Ausstattungsmerkmale</label>
          <div className="mt-3 grid w-full grid-cols-2 gap-5 sm:grid-cols-3">
            {amenitiesQuery.data.map((amenity) => (
              <div
                key={amenity.id}
                className={`flex cursor-pointer flex-col items-start gap-2 rounded-md p-4 ring-1 ${
                  selectedAmenities?.includes(amenity.id)
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
      <InputFieldWrapper id="images" label="Bilder">
        <MultiPictureUpload images={images} setImages={setImages} />
      </InputFieldWrapper>
      <Separator></Separator>
      <div className="flex w-full justify-end">
        <Button className="mt-3 w-full" type="submit">
          Aktualisieren
        </Button>
      </div>
    </form>
  );
};
