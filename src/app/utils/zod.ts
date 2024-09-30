import { z } from "zod";
import { Role } from "@prisma/client";

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
