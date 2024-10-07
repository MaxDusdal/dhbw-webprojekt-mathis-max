import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import CustomButton from "../Buttons/CustomButton";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";

export default function HeaderUserComponent() {
  const user = api.user.getCallerUser.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (user.isLoading) {
    // Return a skeleton loader
    return (
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="flex items-center gap-3 rounded-md p-2 px-2 transition-all duration-200 hover:cursor-pointer hover:bg-gray-200">
          <div className="flex animate-pulse items-center gap-2">
            <div className="h-4 w-24 rounded bg-gray-200"></div>
            <div className="h-8 w-8 rounded-full bg-gray-200"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!user.data && !user.isLoading) {
    return (
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <CustomButton
          fullWidth={false}
          iconPosition="after"
          variant="secondary"
          icon={ArrowRightCircleIcon}
          href="/login"
        >
          Anmelden
        </CustomButton>
      </div>
    );
  }
  if (user) {
    console.log(user.data);
    return (
      <div className="hidden lg:flex lg:flex-1 lg:justify-end">
        <div className="flex items-center gap-3 rounded-md p-2 px-2 transition-all duration-200 hover:cursor-pointer hover:bg-gray-200">
          <p>
            {user.data?.firstName} {user.data?.lastName}
          </p>
          <Image
            src={user.data?.avatar ?? "/images/randomAvatar.jpeg"}
            alt="User"
            width={32}
            height={32}
            className="rounded-full"
          />
        </div>
      </div>
    );
  }

  return null;
}

export function MobileHeaderUserComponent() {
  const user = api.user.getCallerUser.useQuery(undefined, {
    retry: false,
    refetchOnWindowFocus: false,
  });

  if (!user) {
    return (
      <div className="py-6">
        <Link
          href="/login"
          className="-mx-3 block rounded-lg px-3 py-2.5 text-base font-semibold leading-7 text-gray-900 hover:bg-gray-50"
        >
          Jetzt loslegen
        </Link>
      </div>
    );
  }
  if (user.data) {
    return (
      <div className="py-6">
        <div className="flex items-center gap-3 rounded-md p-2 px-2 transition-all duration-200 hover:cursor-pointer hover:bg-gray-200">
          <Image
            src={user.data?.avatar ?? "/images/randomAvatar.jpeg"}
            alt="User"
            width={32}
            height={32}
            className="rounded-full"
          />
          <p>
            {user.data?.firstName} {user.data?.lastName}
          </p>
        </div>
      </div>
    );
  }
}
