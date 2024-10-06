"use client";

import { userProfileSchema } from "~/app/utils/zod";
import CustomButton from "../Buttons/CustomButton";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { api } from "~/trpc/react";
import InputField from "../Inputs/InputField";
import { useEffect } from "react";
import Image from "next/image";

type UserProfileFormValues = z.infer<typeof userProfileSchema>;

export default function UserProfileForm() {
  const schema = userProfileSchema;
  const utils = api.useUtils();
  const userData = api.user.getCallerUser.useQuery();

  const { register, handleSubmit, setValue } = useForm<UserProfileFormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      phoneNumber: "",
      nationality: "",
    },
  });

  useEffect(() => {
    prefillForm();
  }, [userData.data, setValue]);

  function prefillForm() {
    if (userData.data) {
      setValue("firstName", userData.data.firstName || "");
      setValue("lastName", userData.data.lastName || "");
      setValue("email", userData.data.email || "");
      setValue("phoneNumber", userData.data.phoneNumber || "");
      setValue("nationality", userData.data.nationality || "");
    }
  }

  if (userData.isLoading) return <div>Loading...</div>;

  const onSubmit: SubmitHandler<UserProfileFormValues> = async (data) => {
    console.log(data);
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

      <form className="md:col-span-2">
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full flex items-center gap-x-8">
            {userData.data?.avatar ? (
              <Image
                alt=""
                src="/images/randomAvatar.jpeg"
                width={96}
                height={96}
                className="h-24 w-24 flex-none rounded-lg bg-gray-800 object-cover"
              />
            ) : null}

            <div>
              <CustomButton variant="secondary">Change avatar</CustomButton>
              <p className="mt-2 text-xs leading-5 text-gray-400">
                JPG, GIF oder PNG. 1MB max.
              </p>
            </div>
          </div>

          <div className="sm:col-span-3">
            <InputFieldWrapper id="first-name" label="Vorname">
              <InputField
                id="firstName"
                name="firstName"
                register={register}
                placeholder="Max"
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
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="phoneNumber" label="Telefonnummer">
              <InputField
                id="phoneNumber"
                name="phoneNumber"
                register={register}
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="nationality" label="Nationalität">
              <InputField
                id="nationality"
                name="nationality"
                register={register}
              />
            </InputFieldWrapper>
          </div>
        </div>

        <div className="mt-8 flex gap-4">
          <CustomButton type="submit" fullWidth={false}>
            Speichern
          </CustomButton>
          <CustomButton variant="tertiary" fullWidth={false}>
            Abbrechen
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
