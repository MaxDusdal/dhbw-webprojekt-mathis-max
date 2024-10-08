"use client";
import InputFieldWrapper from "../Inputs/InputFieldWrapper";

import { Controller, type FieldError, useForm } from "react-hook-form";
import InputField from "../Inputs/InputField";
import CustomButton from "../Buttons/CustomButton";
import AlertBanner from "../Alerts/AlertBanner";
import { BeatLoader } from "react-spinners";
import { type z } from "zod";
import { signUpSchema } from "~/app/utils/zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { api } from "~/trpc/react";
import { useRouter } from "next/navigation";
import CheckboxFieldset from "../Inputs/CheckboxFieldset";
import Link from "next/link";

type FormValues = z.infer<typeof signUpSchema>;

export default function SignUpForm() {
  const { register, handleSubmit, formState, watch, setValue } = useForm<FormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstName: "",
      lastName: "",
    },
  });

  const router = useRouter();

  const onSubmit = async (data: FormValues) => {
    console.log(data);
    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      if (response.ok) {
        const data = await response.json();
        console.log("User created:", data.user);
        // Redirect to dashboard or home page after successful signup
        router.push("/dashboard");
      } else {
        const errorData = await response.json();
        console.error("Signup error:", errorData.error);
        // Handle error (e.g., show error message to user)
      }
    } catch (error) {
      console.error("Fetch error:", error);
      // Handle network errors
    }
  };
  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <InputFieldWrapper id="firstName" label="Vorname">
          <InputField
            id="firstName"
            name="firstName"
            register={register}
            placeholder="Vorname"
            required
          />
        </InputFieldWrapper>
        <InputFieldWrapper id="lastName" label="Nachname">
          <InputField
            id="lastName"
            name="lastName"
            register={register}
            placeholder="Nachname"
            required
          />
        </InputFieldWrapper>
        <InputFieldWrapper id="email" label="Email">
          <InputField
            id="email"
            name="email"
            register={register}
            placeholder="Email"
            required
            error={formState.errors.email}
          />
        </InputFieldWrapper>
        <InputFieldWrapper id="password" label="Passwort">
          <InputField
            id="password"
            name="password"
            type="password"
            register={register}
            placeholder="Passwort"
            required
            error={formState.errors.password}
          />
        </InputFieldWrapper>

					<CheckboxFieldset
						legend="Benachrichtigungen senden"
						items={[
							{
								id: "privacyPolicy",
								label: "Datenschutzbestimmungen akzeptieren",
								description: "Durch Ihre Registrierung erklären Sie sich mit den Datenschutzbestimmungen einverstanden.",
							},
						]}
						values={{ privacyPolicy: watch("privacyPolicy") }}
						onChange={(id) => setValue("privacyPolicy", !watch("privacyPolicy"))}
					/>
          {formState.errors.privacyPolicy && (
            <p className="text-red-500 text-sm">
              {formState.errors.privacyPolicy.message}
            </p>
          )}

        <div>
          <CustomButton type="submit">
            {formState.isSubmitting ? (
              <BeatLoader size={8} color="#ffffff" />
            ) : (
              "Erstellen"
            )}
          </CustomButton>
        </div>
      </form>

      <div className="flex justify-center">
          <Link
            className="text-sm text-gray-500 mt-6"
          href="/login"
        >
            Bereits registriert? <span className="text-blue-500">Jetzt anmelden</span>
          </Link>
        </div>

      {formState.errors.email && (
        <div className="-mb-4 pt-5">
          <AlertBanner
            type="error"
            header="Login Fehlgeschlagen"
            message={formState.errors.email?.message!}
          />
        </div>
      )}
    </div>
  );
}
