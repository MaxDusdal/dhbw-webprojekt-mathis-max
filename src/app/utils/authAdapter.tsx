import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

export async function getUserFromDB(email: string) {
  const user = await prisma.user.findUnique({
    where: {
      email: email,
    },
  });
  return user;
}

export async function createUser(user: any) {
  try {
    const newUser = await prisma.user.create({
      data: {
        email: user.email,
        hash: user.hash,
        salt: user.salt,
        avatar: user.avatar,
        firstName: user.firstName,
        lastName: user.lastName,
      },
    });

    return newUser;
  } catch (error) {
    console.error("Error creating user:", error);
    throw new Error("Failed to create user");
  }
}
