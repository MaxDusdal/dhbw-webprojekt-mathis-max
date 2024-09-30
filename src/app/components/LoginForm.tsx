"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { BeatLoader } from "react-spinners";
import { useSearchParams } from "next/navigation";
import { credentialsSchema } from "@/utils/zod";
import { SubmitHandler, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import InputField from "@/components/Inputs/InputField";
import InputFieldWrapper from "@/components/Inputs/InputFieldWrapper"
import CustomButton from "@/components/Buttons/CustomButton";
import AlertBanner from "./Alerts/AlertBanner";

type FormValues = z.infer<typeof credentialsSchema>;

const LoginForm = () => {
	const [error, setError] = useState("");
	const params = useSearchParams();
	const callbackUrl = params.get("callbackUrl") || "/dashboard";

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
		const { email, password } = data;
		try {
			const result = await signIn("credentials", {
				redirect: false,
				email,
				password,
			});

			if (result?.error) {
				setError("Die E-Mail und Passwort Kombination ist ungültig.");
			} else if (result?.ok) {
				// Redirect on successful login
				router.push(callbackUrl);
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
					<InputField id="email" name="email" register={register} placeholder="Email" required error={errors.email} />
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
					<CustomButton type="submit">{isSubmitting ? <BeatLoader size={8} color="#ffffff" /> : "Anmelden"}</CustomButton>
				</div>
			</form>

			{error && (
				<div className="-mb-4 pt-5">
					<AlertBanner type="error" header="Login Fehlgeschlagen" message={error} />
				</div>
			)}
		</div>
	);
};

export default LoginForm;
