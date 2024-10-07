import { z } from "zod";
import { Role } from "@prisma/client";

import type { VacationHome, Amenity } from "@prisma/client";

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
  phoneNumber: z.string().optional(),
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

export const vacationhomeCreateSchema = z.object({
  title: z.string().min(3).max(255),
  location: z.string().min(3).max(255),
  images: z.array(z.string().url()).optional(),
  guestCount: z.number().min(1),
  bedroomCount: z.number().min(1),
  bedCount: z.number().min(1),
  bathroomCount: z.number().min(1),
  pricePerNight: z.number().min(0),
  description: z.string().min(3).max(1000),
  houseRules: z.string().min(3).max(1000).optional(),
  cancellationPolicy: z.string().min(3).max(1000).optional(),
  amenities: z.array(z.number()).optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
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
  phoneNumber: z.string().optional(),
  nationality: z.string().optional(),
  preferredLanguage: z.string().optional(),
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
