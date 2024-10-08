import { Suspense } from "react";
import Image from "next/image";

import LoginForm from "~/components/LoginForm";
import SignUpForm from "~/components/Forms/SignUpForm";

export const metadata = {
  title: "Login - Mitarbeiter-Bereich",
  description: "test",
};

export default function SignUpPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <div className="flex min-h-full flex-1 flex-col justify-center px-6 py-12 lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <Image
            src="/images/luftnbn.svg"
            alt="Hardy's Bar & Restaurant"
            width={150}
            height={150}
            className="mx-auto mb-6"
          />
          <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-black">
            Mitarbeiter-Bereich
          </h2>
        </div>

        <SignUpForm />
      </div>
    </Suspense>
  );
}
