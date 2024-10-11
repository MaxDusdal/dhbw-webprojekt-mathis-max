import { DateRange, VacationHomeWithImages } from "~/app/utils/types";
import CustomButton from "~/components/Buttons/CustomButton";
import { format } from "date-fns";
export default function StickyBookMobile({
  dateRange,
  vacationHome,
  getUpdatedParams,
}: {
  dateRange: DateRange | undefined;
  vacationHome: VacationHomeWithImages;
  getUpdatedParams: () => URLSearchParams;
}) {
  return (
    <div className="fixed bottom-0 w-full border-t bg-white py-4 xl:hidden">
      <div className="flex flex-row items-center justify-between px-4">
        <div >
          <p className="text-sm text-gray-500">
            {dateRange && dateRange.from && dateRange.to
              ? `${format(dateRange.from, "dd.MM.yyyy")} - ${format(
                  dateRange.to,
                  "dd.MM.yyyy",
                )}`
              : "test"}
          </p>
          <p className="text-base font-light text-gray-500">
            <span className="text-xl font-medium text-black">
              {vacationHome.pricePerNight.toFixed(2)}€
            </span>{" "}
            Nacht
          </p>
        </div>
        <CustomButton
          fullWidth={false}
          className="px-8 py-3"
          variant="primary"
          href={`/rooms/${vacationHome.id}/book?${getUpdatedParams()}`}
        >
          Reservieren
        </CustomButton>
      </div>
    </div>
  );
}
