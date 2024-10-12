import {
  Session,
  VacationHome,
  Image,
  User,
  Booking,
  Amenity,
} from "@prisma/client";

export type ButtonVariants =
  | "primary"
  | "secondary"
  | "tertiary"
  | "tertiaryWarning"
  | "warning"
  | "disabled";

export type UserWithoutSensitiveInfo = Omit<
  User,
  "hash" | "salt" | "createdAt" | "updatedAt"
>;

export type UserWithAuthRelevantInfo = Omit<
  User,
  | "hash"
  | "salt"
  | "createdAt"
  | "updatedAt"
  | "preferredLanguage"
  | "avatar"
  | "firstName"
  | "lastName"
  | "phoneNumber"
  | "nationality"
>;

export type UserWithSessions = User & {
  sessions: Session[];
};

export type Tab = {
  name: string;
  href: string;
};

export type SectionHeadingActions = {
  buttonText: string;
  buttonVariant: ButtonVariants;
  onClick: () => void;
};

export type DialogTypes = "create" | "destructive" | "default" | "cancel";

export interface GeoIPResponse {
  status: string;
  message: string;
  country: string;
  region: string;
  regionName: string;
  city: string;
  zip: string;
}

export interface UserAgentInfo {
  ua: string;
  browser?: { name?: string; version?: string };
  os?: { name?: string; version?: string };
  device?: { vendor?: string; model?: string; type?: string };
}
export type ImagesUploadCare = {
  uuid: string;
  url: string;
};

export type PlaceSuggestion = {
  place_id: string;
  description: string;
};

export type VacationHomeWithImages = VacationHome & {
  images: Image[];
};

export type DateRange = {
  from: Date | undefined;
  to: Date | undefined;
};

export type BookingWithVhAndImage = Booking & {
  user: User;
  vacationHome: VacationHome & {
    images: Image[];
  };
};

export type BookingWithVhAndImageAndAm = Booking & {
  user: User;
  vacationHome: VacationHome & {
    images: Image[];
    amenities: Amenity[];
  };
};

export type VacationHomeWithDetails = VacationHome & {
  images: Image[];
  bookings: (Booking & {
    user: User;
  })[];
};

export type GetVacationHomesByUserResult = VacationHomeWithDetails[];
