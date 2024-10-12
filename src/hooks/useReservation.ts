import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  parse,
  isValid,
  addDays,
  max,
  isAfter,
  isSameDay,
  format,
} from "date-fns";
import { de } from "date-fns/locale";
import { SelectRangeEventHandler } from "react-day-picker";
import { DateRange } from "~/app/utils/types";
import { notify } from "~/app/utils/notification";

interface Guests {
  adults: number;
  children: number;
  pets: number;
}

enum SectionState {
  VALID,
  INVALID,
  INCOMPLETE,
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
  const [sectionState, setSectionState] = React.useState<SectionState>(
    SectionState.INCOMPLETE,
  );

  const [guests, setGuests] = React.useState<Guests>({
    adults: initalAdult,
    children: initialChildren,
    pets: initialPets,
  });

  const handleSelectCheckIn = (
    date: Date | undefined,
    booked?: DateRange[],
  ) => {
    if (dateRange?.to) {
      setSectionState(
        isSelectionAvailable({ from: date, to: dateRange.to }, booked || []),
      );
    }
    setDateRange((prev) => ({
      from: date,
      to: prev?.to && date && date >= prev.to ? undefined : prev?.to,
    }));
  };

  const handleSelectCheckOut = (
    date: Date | undefined,
    booked?: DateRange[],
  ) => {
    if (dateRange?.from) {
      setSectionState(
        isSelectionAvailable({ from: dateRange.from, to: date }, booked || []),
      );
    }
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

  const getUpdatedParams = () => {
    const params = new URLSearchParams();
    if (dateRange?.from)
      params.set("from", format(dateRange.from, "dd.MM.yyyy", { locale: de }));
    if (dateRange?.to)
      params.set("to", format(dateRange.to, "dd.MM.yyyy", { locale: de }));
    params.set("adults", guests.adults.toString());
    params.set("children", guests.children.toString());
    params.set("pets", guests.pets.toString());
    return params;
  };

  return {
    dateRange,
    setDateRange: handleSetDateRange,
    guests,
    handleSelectCheckIn,
    handleSelectCheckOut,
    handleChange,
    getUpdatedParams,
    sectionState,
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

function isSelectionAvailable(
  selection: DateRange | undefined,
  bookedDates: DateRange[],
) {
  if (!selection?.from || !selection?.to) {
    return SectionState.INCOMPLETE;
  }

  const start = new Date(selection.from);
  const end = new Date(selection.to);

  if (!Array.isArray(bookedDates) || bookedDates.length === 0) {
    notify.success("Gültige Auswahl");
    return SectionState.VALID;
  }

  for (
    let date = new Date(start);
    date <= end;
    date.setDate(date.getDate() + 1)
  ) {
    for (const bookedRange of bookedDates) {
      if (bookedRange.from && bookedRange.to) {
        const bookedStart = new Date(bookedRange.from);
        const bookedEnd = new Date(bookedRange.to);

        if (date >= bookedStart && date <= bookedEnd) {
          notify.error("Diese Daten sind bereits reserviert");
          return SectionState.INVALID;
        }
      }
    }
  }
  notify.success("Gültige Auswahl");
  return SectionState.VALID;
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
