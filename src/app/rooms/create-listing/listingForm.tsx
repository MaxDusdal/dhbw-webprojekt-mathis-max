"use client";
import React, { useCallback, useEffect } from "react";
import { useForm, Controller, FieldError } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import QuantitySelector from "../../../components/listings/QuantitySelector";
import { Card, CardContent } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
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
import { vacationhomeCreateSchema } from "~/app/utils/zod";
import AdressAutoComplete from "~/components/Inputs/AdressAutoComplete";
import { notify } from "~/app/utils/notification";
import MultiPictureUpload from "~/components/Inputs/MultiPictureUpload";
import type { ImagesUploadCare } from "~/app/utils/types";
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

type VacationHomeFormData = z.infer<typeof vacationhomeCreateSchema>;

const VacationHomeForm = () => {
  const [images, setImages] = React.useState<ImagesUploadCare[]>([]);
  const [adressAutoCompleteReturn, setAdressAutoCompleteReturn] =
    React.useState<AdressAutoCompleteReturn>();

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    register,
    watch,
  } = useForm<VacationHomeFormData>({
    resolver: zodResolver(vacationhomeCreateSchema),
    defaultValues: {
      guestCount: 1,
      bedroomCount: 1,
      bedCount: 1,
      bathroomCount: 1,
      isAvailable: true,
      amenities: [],
    },
  });

  const mutation = api.vacationhome.create.useMutation({
    onSuccess: () => {
      notify.success("Inserat erfolgreich erstellt");
    },
    onError: (error) => {
      notify.error("Fehler beim Erstellen des Inserats");
      console.error(error);
    },
  });

  function onSubmit(data: VacationHomeFormData) {
    mutation.mutate(data);
  }

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
      <AdressAutoComplete
        description="Adresse"
        setAdressAutoCompleteReturn={setAdressAutoCompleteReturn}
      />
      <InputFieldWrapper id="pricePerNight" label="Preis pro Nacht">
        <InputField
          name="pricePerNight"
          id="pricePerNight"
          type="number"
          register={register}
          error={errors.pricePerNight as FieldError}
        ></InputField>
      </InputFieldWrapper>
      <div>
        {quantityFields.map((field, index) => (
          <>
            <Controller
              name={field.name}
              control={control}
              key={field.name}
              render={({ field: { onChange, value } }) => (
                <QuantitySelector
                  label={<span>{field.label}</span>}
                  value={value}
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
      </div>
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
      <MultiPictureUpload images={images} setImages={setImages} />
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
