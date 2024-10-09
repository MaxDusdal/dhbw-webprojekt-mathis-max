import React from "react";
import { useRouter } from "next/navigation";
import { parse, isValid, addDays, max, isAfter, isSameDay } from "date-fns";
import { SelectRangeEventHandler } from "react-day-picker";

interface DateRange {
  from: Date | undefined;
  to: Date | undefined;
}

interface Guests {
  adults: number;
  children: number;
  pets: number;
}

export function useReservation(
  initialDateRange: DateRange,
  initalAdult: number,
  initialChildren: number,
  initialPets: number,
) {
  const router = useRouter();

  const [dateRange, setDateRange] = React.useState<DateRange | undefined>(
    () => {
      return initialDateRange;
    },
  );

  const [guests, setGuests] = React.useState<Guests>({
    adults: initalAdult,
    children: initialChildren,
    pets: initialPets,
  });

  const handleSelectCheckIn = (date: Date | undefined) => {
    setDateRange((prev) => ({
      from: date,
      to: prev?.to && date && date >= prev.to ? undefined : prev?.to,
    }));
  };

  const handleSelectCheckOut = (date: Date | undefined) => {
    setDateRange((prev) => ({
      from: prev?.from,
      to: date,
    }));
  };

  const handleChange = (type: keyof Guests) => (value: number) => {
    setGuests((prev) => ({ ...prev, [type]: value }));
  };
  const handleSetDateRange: SelectRangeEventHandler = (range) => {
    setDateRange(range as DateRange | undefined);
  };

  return {
    dateRange,
    setDateRange: handleSetDateRange,
    guests,
    handleSelectCheckIn,
    handleSelectCheckOut,
    handleChange,
  };
}

export function verifyAmountParam(
  queryParam: string | null | undefined,
  min: number,
  max: number,
  def: number,
) {
  if (queryParam && !isNaN(Number(queryParam))) {
    if (Number(queryParam) >= min && Number(queryParam) <= max) {
      return Number(queryParam);
    }
  }
  return def;
}

export function verifyDateParamWithDefault(
  from: string | null | undefined,
  to: string | null | undefined,
): DateRange {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const parseDate = (
    dateString: string | null | undefined,
  ): Date | undefined => {
    if (!dateString) return undefined;
    const parsedDate = parse(dateString, "dd.MM.yyyy", new Date());
    return isValid(parsedDate) ? parsedDate : undefined;
  };

  let fromDate = parseDate(from);
  let toDate = parseDate(to);

  if (!fromDate && !toDate) {
    fromDate = addDays(today, 7);
    toDate = addDays(fromDate, 5);
  } else if (fromDate && !toDate) {
    toDate = addDays(fromDate, 5);
  } else if (!fromDate && toDate) {
    fromDate = max([addDays(toDate, -5), today]);
  }

  if (fromDate && fromDate < today) {
    fromDate = today;
  }

  if (fromDate && toDate && toDate <= fromDate) {
    toDate = addDays(fromDate, 1);
  }

  if (toDate && toDate <= today) {
    toDate = addDays(today, 1);
  }

  return {
    from: fromDate,
    to: toDate,
  };
}

export function verifyDateParam(
  from: string | null | undefined,
  to: string | null | undefined,
): DateRange {
  const td = new Date();
  const today = new Date(td.getFullYear(), td.getMonth(), td.getDate());

  const parseDate = (
    dateString: string | null | undefined,
  ): Date | undefined => {
    if (!dateString) return undefined;
    const parsedDate = parse(dateString, "dd.MM.yyyy", new Date());
    return isValid(parsedDate) ? parsedDate : undefined;
  };

  let fromDate = parseDate(from);
  let toDate = parseDate(to);

  // Prüfe, ob fromDate nach dem heutigen Datum liegt
  if (fromDate && !(isAfter(fromDate, today) || isSameDay(fromDate, td))) {
    fromDate = undefined;
  }

  // Prüfe, ob toDate nach fromDate liegt
  if (fromDate && toDate && !isAfter(toDate, fromDate)) {
    toDate = undefined;
  }

  return {
    from: fromDate,
    to: toDate,
  };
}
