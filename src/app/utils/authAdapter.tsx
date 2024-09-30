import { PrismaClient, User } from "@prisma/client";
import { UserWithAuthRelevantInfo } from "./types";
const prisma = new PrismaClient();
export async function getUserFromDB(email: string): Promise<User | null> {
  try {
    const user = await prisma.user.findUnique({
      where: {
        email: email,
      },
    });
    return user;
  } catch (error) {
    console.error("Error getting user from DB:", error);
    return null;
  }
}

export async function createUser(user: any): Promise<UserWithAuthRelevantInfo> {
  try {
    const createdUser = await prisma.user.create({
      data: {
        email: user.email,
        hash: user.hash,
        salt: user.salt,
        firstName: user.firstName,
        lastName: user.lastName,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      select: {
        id: true,
        email: true,
        role: true,
      },
    });

    return createdUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
