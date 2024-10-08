"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { type z } from "zod";
import { passwordSchema } from "~/app/utils/zod";
import InputField from "../Inputs/InputField";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import CustomButton from "../Buttons/CustomButton";
import { api } from "~/trpc/react";

type CloseSessionsFormValues = z.infer<typeof passwordSchema>;

export default function CloseSessionsForm() {
  const schema = passwordSchema;

  const mutation = api.user.deleteAllSessions.useMutation();

  const { register, handleSubmit, setError, formState, reset } =
    useForm<CloseSessionsFormValues>({
      resolver: zodResolver(schema),
      mode: "onBlur",
      defaultValues: {
        password: "",
      },
    });

  const onSubmit = async (data: CloseSessionsFormValues) => {
    try {
      await mutation.mutateAsync(data);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-black">
          Alle Sitzungen schließen
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Bitte geben Sie Ihr Passwort ein, um zu bestätigen, dass Sie alle Ihre
          Sitzungen auf allen Ihren Geräten schließen möchten.
        </p>
      </div>

      <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full">
            <InputFieldWrapper id="password" label="Ihr Aktuelles Passwort">
              <InputField
                id="password"
                name="password"
                type="password"
                register={register}
                error={formState.errors.password}
              />
            </InputFieldWrapper>
          </div>
        </div>

        <div className="mt-8 flex">
          <CustomButton type="submit" variant="primary" fullWidth={false}>
            Alle Sitzungen schließen
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
