import { type User } from "@prisma/client";

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
