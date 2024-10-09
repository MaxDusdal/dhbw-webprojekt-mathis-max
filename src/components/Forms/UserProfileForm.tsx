"use client";

import { userProfileSchema } from "~/app/utils/zod";
import CustomButton from "../Buttons/CustomButton";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import { FieldError, type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import { api } from "~/trpc/react";
import InputField from "../Inputs/InputField";
import { useEffect } from "react";
import { notify } from "~/app/utils/notification";
import { TRPCError } from "@trpc/server";
import { E164Number } from "libphonenumber-js";
import AvatarUploadForm from "./AvatarUploadForm";

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export default function UserProfileForm() {
  const schema = userProfileSchema;
  const utils = api.useUtils();
  const userData = api.user.getCallerUser.useQuery();

  const updateUser = api.user.updateUser.useMutation({
    onSuccess: () => {
      notify.success("Benutzer erfolgreich aktualisiert");
      utils.user.getCallerUser.invalidate();
    },
    onError: (error) => {
      console.error(error);
    },
  });

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<UserProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
    },
  });

  const watchAllFields = watch();

  useEffect(() => {
    prefillForm();
  }, [userData.data, setValue]);

  function prefillForm() {
    if (userData.data) {
      setValue("firstName", userData.data.firstName || "");
      setValue("lastName", userData.data.lastName || "");
      setValue("email", userData.data.email || "");
      setValue(
        "phoneNumber",
        userData.data.phoneNumber
          ? (userData.data.phoneNumber as E164Number)
          : undefined,
      );
    }
  }

  if (userData.isLoading) return <div>Loading...</div>;

  const onSubmit: SubmitHandler<UserProfileFormValues> = async (data) => {
    try {
      await updateUser.mutateAsync(data);
    } catch (error) {
      notify.error((error as TRPCError).message);
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-black">
          Persönliche Informationen
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Hier können Sie Ihre persönlichen Informationen bearbeiten.
        </p>
      </div>

      <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <AvatarUploadForm />

          <div className="sm:col-span-3">
            <InputFieldWrapper id="first-name" label="Vorname">
              <InputField
                id="firstName"
                name="firstName"
                register={register}
                placeholder="Max"
                error={errors.firstName as FieldError}
              />
            </InputFieldWrapper>
          </div>

          <div className="sm:col-span-3">
            <InputFieldWrapper id="last-name" label="Nachname">
              <InputField
                id="lastName"
                name="lastName"
                register={register}
                placeholder="Mustermann"
                error={errors.lastName as FieldError}
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="email" label="E-Mail Adresse">
              <InputField
                id="email"
                name="email"
                register={register}
                type="email"
                error={errors.email as FieldError}
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="phoneNumber" label="Telefonnummer">
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                register={register}
                error={errors.phoneNumber as FieldError}
              />
            </InputFieldWrapper>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <CustomButton type="submit" fullWidth={false}>
            Speichern
          </CustomButton>
          <CustomButton
            variant="tertiary"
            fullWidth={false}
            onClick={() => {
              prefillForm();
            }}
          >
            Abbrechen
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
