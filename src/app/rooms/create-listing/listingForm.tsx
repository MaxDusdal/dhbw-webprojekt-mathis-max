import React from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Textarea } from "~/components/ui/textarea";
import { Checkbox } from "~/components/ui/checkbox";
import QuantitySelector from "./QuantitySelector";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuTrigger,
} from "~/components/ui/context-menu";
import { UploadButton, UploadDropzone } from "~/app/utils/uploadthing";
import "@uploadthing/react/styles.css";

// Define the Zod schema for form validation
const vacationHomeSchema = z.object({
  title: z.string().min(1, "Title is required"),
  location: z.string().min(1, "Location is required"),
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
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<VacationHomeFormData>({
    resolver: zodResolver(vacationHomeSchema),
    defaultValues: initialData || {
      guestCount: 1,
      bedroomCount: 1,
      bedCount: 1,
      bathroomCount: 1,
      isAvailable: true,
    },
  });

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
          render={({ field }) => (
            <Input
              {...field}
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
                  label="Gäste"
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
                  label="Schlafzimmer"
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
                  label="Betten"
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
                  label="Badezimmer/WCs"
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

      <UploadDropzone
        className="p-6"
        endpoint="imageUploader"
        onClientUploadComplete={(res) => {
          // Do something with the response
          console.log("Files: ", res);
          alert("Upload Completed");
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />

      <div className="flex w-full justify-end">
        <Button className="mt-3" type="submit">
          Erstellen
        </Button>
      </div>
    </form>
  );
};

export default VacationHomeForm;

/*
      <div>
        <label
          htmlFor="location"
          className="block text-sm font-medium text-gray-700"
        >
          Location
        </label>
        <Controller
          name="location"
          control={control}
          render={({ field }) => (
            <Input {...field} id="location" className="mt-1" />
          )}
        />
        {errors.location && (
          <p className="mt-1 text-sm text-red-600">{errors.location.message}</p>
        )}
      </div>

      <div className="flex items-center">
        <Controller
          name="isAvailable"
          control={control}
          render={({ field }) => (
            <Checkbox
              id="isAvailable"
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          )}
        />
        <label
          htmlFor="isAvailable"
          className="ml-2 block text-sm text-gray-900"
        >
          Available for booking
        </label>
      </div>

      <div>
        <label
          htmlFor="latitude"
          className="block text-sm font-medium text-gray-700"
        >
          Latitude (optional)
        </label>
        <Controller
          name="latitude"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="latitude"
              type="number"
              step="any"
              className="mt-1"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="longitude"
          className="block text-sm font-medium text-gray-700"
        >
          Longitude (optional)
        </label>
        <Controller
          name="longitude"
          control={control}
          render={({ field }) => (
            <Input
              {...field}
              id="longitude"
              type="number"
              step="any"
              className="mt-1"
            />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="houseRules"
          className="block text-sm font-medium text-gray-700"
        >
          House Rules (optional)
        </label>
        <Controller
          name="houseRules"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="houseRules" className="mt-1" />
          )}
        />
      </div>

      <div>
        <label
          htmlFor="cancellationPolicy"
          className="block text-sm font-medium text-gray-700"
        >
          Cancellation Policy (optional)
        </label>
        <Controller
          name="cancellationPolicy"
          control={control}
          render={({ field }) => (
            <Textarea {...field} id="cancellationPolicy" className="mt-1" />
          )}
        />
      </div>

*/
