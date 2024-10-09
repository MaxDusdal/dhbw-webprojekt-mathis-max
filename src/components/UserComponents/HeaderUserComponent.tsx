import Link from "next/link";
import Image from "next/image";
import { api } from "~/trpc/react";
import CustomButton from "../Buttons/CustomButton";
import { ArrowRightCircleIcon } from "@heroicons/react/24/outline";
import { useState } from "react";
import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";

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
      <Menu as="div" className="hidden lg:relative text-left lg:flex lg:flex-1 lg:justify-end">
        <div>
          <MenuButton>
            <div className="hidden lg:flex lg:flex-1 lg:justify-end">
              <div className="flex items-center gap-3 rounded-md p-2 px-2 transition-all duration-200 hover:cursor-pointer hover:bg-gray-200">
                <p>
                  {user.data?.firstName}
                </p>
                <Image
                  src={"/images/randomAvatar.jpeg"}
                  alt="User"
                  width={32}
                  height={32}
                  className="rounded-full"
                />
              </div>
            </div>
          </MenuButton>
        </div>

        <MenuItems
          transition
          className="absolute top-12 right-0 z-10 mt-2 w-56 origin-top-right divide-y divide-gray-100 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
        >
          <div className="px-4 py-3">
            <p className="text-sm">Eingeloggt als</p>
            <p className="truncate text-sm font-medium text-gray-900">
              {user.data?.email}
            </p>
          </div>
          <div className="py-1">
            <MenuItem>
              <Link
                href="/account/profile"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Account Einstellungen
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href="/account/bookings"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Ihre Buchungen
              </Link>
            </MenuItem>
            <MenuItem>
              <Link
                href="/account/rooms"
                className="block px-4 py-2 text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
              >
                Ihre Inserate
              </Link>
            </MenuItem>
          </div>
          <div className="py-1">
            <form action="/api/auth/signout" method="POST">
              <MenuItem>
                <button
                  type="submit"
                  className="block w-full px-4 py-2 text-left text-sm text-gray-700 data-[focus]:bg-gray-100 data-[focus]:text-gray-900"
                >
                  Abmelden
                </button>
              </MenuItem>
            </form>
          </div>
        </MenuItems>
      </Menu>
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
