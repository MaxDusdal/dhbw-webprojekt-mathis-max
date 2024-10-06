import CustomButton from "~/components/Buttons/CustomButton";
import ChangePasswordForm from "~/components/Forms/ChangePasswordForm";
import UserProfileForm from "~/components/Forms/UserProfileForm";
import InputFieldWrapper from "~/components/Inputs/InputFieldWrapper";

const secondaryNavigation = [
  { name: "Account", href: "#", current: true },
  { name: "Notifications", href: "#", current: false },
  { name: "Billing", href: "#", current: false },
  { name: "Teams", href: "#", current: false },
  { name: "Integrations", href: "#", current: false },
];

export default function ProfilePage() {
  return (
    <main>
      <h1 className="sr-only">Account Settings</h1>

      <header className="border-b border-white/5">
        {/* Secondary navigation */}
        <nav className="flex overflow-x-auto py-4">
          <ul
            role="list"
            className="flex min-w-full flex-none gap-x-6 px-4 text-sm font-semibold leading-6 text-gray-400 sm:px-6 lg:px-8"
          >
            {secondaryNavigation.map((item) => (
              <li key={item.name}>
                <a
                  href={item.href}
                  className={item.current ? "text-indigo-400" : ""}
                >
                  {item.name}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </header>

      {/* Settings forms */}
      <div className="divide-y divide-white/5">
        <UserProfileForm />

        <ChangePasswordForm />

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-black">
              Log out other sessions
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              Please enter your password to confirm you would like to log out of
              your other sessions across all of your devices.
            </p>
          </div>

          <form className="md:col-span-2">
            <div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:max-w-xl sm:grid-cols-6">
              <div className="col-span-full">
                <label
                  htmlFor="logout-password"
                  className="block text-sm font-medium leading-6 text-black"
                >
                  Your password
                </label>
                <div className="mt-2">
                  <input
                    id="logout-password"
                    name="password"
                    type="password"
                    autoComplete="current-password"
                    className="block w-full rounded-md border-0 bg-white/5 py-1.5 text-black shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>
            </div>

            <div className="mt-8 flex">
              <button
                type="submit"
                className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
              >
                Log out other sessions
              </button>
            </div>
          </form>
        </div>

        <div className="grid max-w-7xl grid-cols-1 gap-x-8 gap-y-10 px-4 py-16 sm:px-6 md:grid-cols-3 lg:px-8">
          <div>
            <h2 className="text-base font-semibold leading-7 text-black">
              Delete account
            </h2>
            <p className="mt-1 text-sm leading-6 text-gray-400">
              No longer want to use our service? You can delete your account
              here. This action is not reversible. All information related to
              this account will be deleted permanently.
            </p>
          </div>

          <form className="flex items-start md:col-span-2">
            <button
              type="submit"
              className="rounded-md bg-red-500 px-3 py-2 text-sm font-semibold text-black shadow-sm hover:bg-red-400"
            >
              Yes, delete my account
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
