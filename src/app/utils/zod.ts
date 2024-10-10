import { z } from "zod";
import { Role } from "@prisma/client";

import type { VacationHome, Amenity } from "@prisma/client";
import { parsePhoneNumberFromString } from "libphonenumber-js";

export const credentialsSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export const passwordSchema = z.object({
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,32}$/,
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    ),
});

export const userCreateSchema = z.object({
  email: z.string().email(),
  role: z.nativeEnum(Role),
  avatar: z.string().url().optional(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  phoneNumber: z
    .string()
    .optional()
    .transform((arg, ctx) => {
      if (!arg) return undefined;

      const phone = parsePhoneNumberFromString(arg, {
        defaultCountry: "DE",
        extract: false,
      });

      if (phone && phone.isValid()) {
        return phone.number;
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number",
      });
      return undefined;
    }),
  nationality: z.string().optional(),
  preferredLanguage: z.string().optional(),
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,32}$/,
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    ),
});

export const signUpSchema = z.object({
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .max(32)
    .regex(
      /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,32}$/,
      "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character",
    ),
  privacyPolicy: z.boolean().refine((data) => data === true, {
    message: "Datenschutzbestimmungen müssen akzeptiert werden",
  }),
});

export const vacationhomeCreateSchema = z.object({
  title: z
    .string()
    .min(3, "Titel muss aus mindestens 3 Zeichen bestehen")
    .max(255, "Titel muss aus weniger als 255 Zeichen bestehen"),
  images: z.array(z.string().url()).optional(),
  guestCount: z
    .number()
    .min(1, "Anzahl der Gäste muss aus mindestens 1 bestehen"),
  bedroomCount: z
    .number()
    .min(1, "Anzahl der Schlafzimmer muss aus mindestens 1 bestehen"),
  bedCount: z
    .number()
    .min(1, "Anzahl der Betten muss aus mindestens 1 bestehen"),
  bathroomCount: z
    .number()
    .min(1, "Anzahl der Bäder muss aus mindestens 1 bestehen"),
  pricePerNight: z.number().min(0, "Preis pro Nacht muss positiv sein"),
  description: z
    .string()
    .min(10, "Beschreibung muss aus mindestens 10 Zeichen bestehen")
    .max(1000, "Beschreibung muss aus weniger als 1000 Zeichen bestehen"),
  houseRules: z
    .string()
    .min(3, "Hausregeln müssen aus mindestens 3 Zeichen bestehen")
    .max(1000, "Hausregeln müssen aus weniger als 1000 Zeichen bestehen")
    .optional(),
  cancellationPolicy: z
    .string()
    .min(3, "Stornierungsbedingungen müssen aus mindestens 3 Zeichen bestehen")
    .max(
      1000,
      "Stornierungsbedingungen müssen aus weniger als 1000 Zeichen bestehen",
    )
    .optional(),
  amenities: z
    .array(z.number())
    .min(1, "Mindestens eine Einrichtung ist erforderlich")
    .optional(),
  latitude: z.number(),
  longitude: z.number(),
  locationDescription: z.string(),
  isAvailable: z.boolean().optional(),
});

export const amenityCreateSchema = z.object({
  icon: z.string(),
  name: z.string().min(2).max(255),
  description: z.string().min(3).max(1000),
  category: z.string().min(3).max(255),
});

export const userProfileSchema = z.object({
  avatar: z.string().url().optional(),
  firstName: z.string().min(3),
  lastName: z.string().min(3),
  phoneNumber: z
    .string()
    .optional()
    .transform((arg, ctx) => {
      if (!arg) return undefined;

      const phone = parsePhoneNumberFromString(arg, {
        defaultCountry: "DE",
        extract: false,
      });

      if (phone && phone.isValid()) {
        return phone.number;
      }

      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Invalid phone number",
      });
      return undefined;
    }),
  email: z.string().email(),
});

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, "Aktuelles Passwort ist erforderlich"),
    newPassword: z
      .string()
      .min(8, "Neues Passwort muss aus mindestens 8 Zeichen bestehen")
      .max(32, "Neues Passwort muss aus weniger als 32 Zeichen bestehen")
      .regex(
        /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*\W)(?!.* ).{8,32}$/,
        "Passwort muss aus mindestens 8 Zeichen, 1 Großbuchstaben, 1 Kleinbuchstaben, 1 Zahl und 1 Sonderzeichen bestehen",
      ),
    confirmPassword: z.string().min(1, "Passwort bestätigen ist erforderlich"),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwörter müssen übereinstimmen",
    path: ["confirmPassword"],
  });

export const bookingCreateSchema = z
  .object({
    checkInDate: z.date(),
    checkOutDate: z.date(),
    guestCount: z
      .number()
      .min(1, "Anzahl der Gäste muss aus mindestens 1 bestehen"),
    vacationHomeId: z.number(),
  })
  .refine((data) => data.checkInDate < data.checkOutDate, {
    message: "Check-in und Check-out Datum sind ungültig",
    path: ["checkOutDate"],
  })
  .refine((data) => data.checkInDate >= new Date(), {
    message: "Check-in Datum muss in der Zukunft liegen",
    path: ["checkInDate"],
  });
