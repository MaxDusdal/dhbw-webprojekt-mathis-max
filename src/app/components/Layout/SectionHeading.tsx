"use client";
import { usePathname } from "next/navigation";
import { clx } from "~/app/utils/clx";
import { SectionHeadingActions, Tab } from "~/app/utils/types";
import CustomButton from "../Buttons/CustomButton";

const tabs = [
  { name: "Applied", href: "#", current: false },
  { name: "Phone Screening", href: "#", current: false },
  { name: "Interview", href: "#", current: true },
  { name: "Offer", href: "#", current: false },
  { name: "Hired", href: "#", current: false },
];

export default function SectionHeading({
  tabs,
  header,
  actions,
}: {
  tabs: Tab[];
  header: string;
  actions: SectionHeadingActions[];
}) {
  const pathname = usePathname();

  // Function to check if a tab is current
  const isTabCurrent = (tabHref: string) => pathname.includes(tabHref);

  return (
    <div className="relative border-b border-gray-200 pb-5 sm:pb-0">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 md:flex md:items-center md:justify-between lg:px-8">
        <h3 className="text-lg font-semibold leading-6 text-gray-900">
          {header}
        </h3>
        {actions.map((action) => (
          <CustomButton
            key={action.buttonText}
            variant={action.buttonVariant}
            onClick={action.onClick}
          >
            {action.buttonText}
          </CustomButton>
        ))}
      </div>
      <div className="mx-auto mt-4 max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="sm:hidden">
          <label htmlFor="current-tab" className="sr-only">
            Select a tab
          </label>
          <select
            id="current-tab"
            name="current-tab"
            defaultValue={tabs.find((tab) => isTabCurrent(tab.href))?.name}
            className="block w-full rounded-md border-0 py-1.5 pl-3 pr-10 ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600"
          >
            {tabs.map((tab) => (
              <option key={tab.name}>{tab.name}</option>
            ))}
          </select>
        </div>
        <div className="hidden sm:block">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <a
                key={tab.name}
                href={tab.href}
                aria-current={isTabCurrent(tab.href) ? "page" : undefined}
                className={clx(
                  isTabCurrent(tab.href)
                    ? "border-blue-500 text-blue-600"
                    : "border-transparent text-gray-500 hover:border-gray-300 hover:text-gray-700",
                  "whitespace-nowrap border-b-2 px-1 pb-4 text-sm font-medium",
                )}
              >
                {tab.name}
              </a>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
}
