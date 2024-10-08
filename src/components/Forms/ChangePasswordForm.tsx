"use client";
import { changePasswordSchema } from "~/app/utils/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";
import InputField from "../Inputs/InputField";
import CustomButton from "../Buttons/CustomButton";
import { useState } from "react";
import { api } from "~/trpc/react";
import { notify } from "~/app/utils/notification";
import { TRPCError } from "@trpc/server";
import { TRPCClientError } from "@trpc/client";

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

export default function ChangePasswordForm() {
  const schema = changePasswordSchema;
  const [wrongCurrentPassword, setWrongCurrentPassword] = useState(false);
  const { register, handleSubmit, setError, formState, reset } =
    useForm<ChangePasswordFormValues>({
      resolver: zodResolver(schema),
      mode: "onBlur",
      defaultValues: {
        currentPassword: "",
        newPassword: "",
        confirmPassword: "",
      },
    });

  const mutation = api.user.changePassword.useMutation();

  const onSubmit: SubmitHandler<ChangePasswordFormValues> = async (data) => {
    try {
      const promise = mutation.mutateAsync(data);
      notify.promise(promise, {
        loading: "Passwort wird geändert...",
        success: "Passwort erfolgreich geändert",
        error: "Passwort konnte nicht geändert werden",
      });
      await promise;
      reset();
    } catch (error) {
      if (
        error instanceof TRPCClientError &&
        error.message === "Aktuelles Passwort ist falsch"
      ) {
        setWrongCurrentPassword(true);
        setError("currentPassword", {
          type: "manual",
          message: "Aktuelles Passwort ist falsch",
        });
      } else {
        console.error(error);
      }
    }
  };

  return (
    <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
      <div>
        <h2 className="text-base font-semibold leading-7 text-black">
          Passwort ändern
        </h2>
        <p className="mt-1 text-sm leading-6 text-gray-400">
          Ändern Sie Ihr Passwort, das mit Ihrem Account verbunden ist.
        </p>
      </div>

      <form className="md:col-span-2" onSubmit={handleSubmit(onSubmit)}>
        <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
          <div className="col-span-full">
            <InputFieldWrapper id="currentPassword" label="Aktuelles Passwort">
              <InputField
                id="currentPassword"
                name="currentPassword"
                type="password"
                placeholder="Aktuelles Passwort"
                register={register}
                error={formState.errors.currentPassword}
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="newPassword" label="Neues Passwort">
              <InputField
                id="newPassword"
                name="newPassword"
                type="password"
                placeholder="Neues Passwort"
                register={register}
                error={formState.errors.newPassword}
              />
            </InputFieldWrapper>
          </div>

          <div className="col-span-full">
            <InputFieldWrapper id="confirmPassword" label="Passwort bestätigen">
              <InputField
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                placeholder="Passwort bestätigen"
                register={register}
                error={formState.errors.confirmPassword}
              />
            </InputFieldWrapper>
          </div>
        </div>

        <div className="mt-8 flex">
          <CustomButton type="submit" variant="primary" fullWidth={false}>
            Ändern
          </CustomButton>
        </div>
      </form>
    </div>
  );
}
