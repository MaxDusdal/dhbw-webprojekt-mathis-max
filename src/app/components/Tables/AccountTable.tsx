import { Menu, MenuButton, MenuItem, MenuItems } from "@headlessui/react";
import { UserCircleIcon } from "@heroicons/react/20/solid";
import { EllipsisVerticalIcon, UserIcon } from "@heroicons/react/24/outline";
import { BeatLoader } from "react-spinners";
import { User } from "@prisma/client";
import { api } from "~/trpc/react";
import { notify } from "~/app/utils/notification";

export default function UsersTable({ users, isLoading }: { users: User[]; isLoading: boolean }) {
	const utils = api.useUtils();

    if (isLoading) {
        return (
            <div className="flex h-full items-center justify-center">
                <BeatLoader size="10px" color="#1E88E5" loading={isLoading} />
            </div>
        );
    }

	const mutation = api.user.delete.useMutation({
		onSuccess: () => {
			utils.user.invalidate();
		},
	});

	const handleDelete = async (id: string) => {
		const promise = mutation.mutateAsync({ id });
		notify.promise(promise, {
			pending: "User wird gelöscht...",
			success: "User erfolgreich gelöscht",
			error: "Fehler beim Löschen des Users",
		});
		await promise;
	};

	return (
		<ul role="list" className="divide-y divide-gray-100">
			{users.map((user) => (
				<li key={user.email} className="flex justify-between gap-x-6 py-5">
					<div className="flex min-w-0 gap-x-4">
						<UserCircleIcon className="h-12 w-12 flex-none rounded-full bg-gray-50 text-blue-500" />
						<div className="min-w-0 flex-auto">
							<p className="text-sm font-semibold leading-6 text-gray-900">
								<a href={user.firstName + " " + user.lastName} className="hover:underline">
									{user.firstName + " " + user.lastName}
								</a>
							</p>
							<p className="mt-1 flex text-xs leading-5 text-gray-500">
								<a href={`mailto:${user.email}`} className="truncate hover:underline">
									{user.email}
								</a>
							</p>
						</div>
					</div>
					<div className="flex shrink-0 items-center gap-x-6">
						<div className="hidden sm:flex sm:flex-col sm:items-end">
							<p className="text-sm leading-6 text-gray-900">{user.role}</p>

							{/* person.lastSeen ? (
                <p className="mt-1 text-xs leading-5 text-gray-500">
                  Last seen <time dateTime={person.lastSeenDateTime}>{person.lastSeen}</time>
                </p>
              ) : (
                <div className="mt-1 flex items-center gap-x-1.5">
                  <div className="flex-none rounded-full bg-emerald-500/20 p-1">
                    <div className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  </div>
                  <p className="text-xs leading-5 text-gray-500">Online</p>
                </div>
              ) */}
						</div>
						<Menu as="div" className="relative flex-none">
							<MenuButton className="-m-2.5 block p-2.5 text-gray-500 hover:text-gray-900">
								<span className="sr-only">Open options</span>
								<EllipsisVerticalIcon aria-hidden="true" className="h-5 w-5" />
							</MenuButton>
							<MenuItems
								transition
								className="absolute right-0 z-10 mt-2 w-32 origin-top-right rounded-md bg-white py-2 shadow-lg ring-1 ring-gray-900/5 transition focus:outline-none data-[closed]:scale-95 data-[closed]:transform data-[closed]:opacity-0 data-[enter]:duration-100 data-[leave]:duration-75 data-[enter]:ease-out data-[leave]:ease-in"
							>
								<MenuItem>
									<a href="#" className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
										View profile<span className="sr-only">, {user.email}</span>
									</a>
								</MenuItem>
								<MenuItem>
									<button onClick={() => handleDelete(user.id)} className="block px-3 py-1 text-sm leading-6 text-gray-900 data-[focus]:bg-gray-50">
										Löschen
									</button>
								</MenuItem>
							</MenuItems>
						</Menu>
					</div>
				</li>
			))}
		</ul>
	);
}
