"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { credentialsSchema } from "@/utils/zod";
import { type SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { type z } from "zod";
import InputField from "~/components/Inputs/InputField";
import InputFieldWrapper from "~/components/Inputs/InputFieldWrapper";
import CustomButton from "~/components/Buttons/CustomButton";
import AlertBanner from "./Alerts/AlertBanner";
import Link from "next/link";

type FormValues = z.infer<typeof credentialsSchema>;

const LoginForm = () => {
  const [error, setError] = useState("");
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") || "/rooms";

  const schema = credentialsSchema;

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit: SubmitHandler<FormValues> = async (data) => {
    setError("");
    try {
      const response = await fetch("/api/auth/signin", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const data = await response.json();
        // Redirect to dashboard or home page after successful signup
        router.push("/");
      } else {
        const errorData = await response.json();
        console.error("Signup error:", errorData.error);
        setError(errorData.error);
      }
    } catch (error) {
      setError("An unexpected error occurred. Please try again.");
      console.error(error);
    }
  };

  return (
    <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
      <form className="space-y-6" onSubmit={handleSubmit(onSubmit)}>
        <InputFieldWrapper id="email" label="Email">
          <InputField
            id="email"
            name="email"
            register={register}
            placeholder="Email"
            required
            error={errors.email}
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
            error={errors.password}
          />
        </InputFieldWrapper>

        <div>
          <CustomButton type="submit">
            {isSubmitting ? (
              <BeatLoader size={8} color="#ffffff" />
            ) : (
              "Anmelden"
            )}
          </CustomButton>
        </div>
      </form>

      <div className="flex justify-center">
          <Link
            className="text-sm text-gray-500 mt-6"
          href="/signup"
        >
            Noch kein Account? <span className="text-blue-500">Jetzt registrieren</span>
          </Link>
        </div>

      {error && (
        <div className="-mb-4 pt-5">
          <AlertBanner
            type="error"
            header="Login Fehlgeschlagen"
            message={error}
          />
        </div>
      )}
    </div>
  );
};

export default LoginForm;
