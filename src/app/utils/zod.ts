import { z } from "zod";
import { Role } from "@prisma/client";

import type { VacationHome, Amenity} from "@prisma/client";

export const credentialsSchema = z.object({
  email: z.string().email(), 
  password: z.string().min(1),
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
  password: z.string().min(8).max(32).regex(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,32}$/, "Password must contain at least 8 characters, 1 uppercase letter, 1 lowercase letter, 1 number and 1 special character"),
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