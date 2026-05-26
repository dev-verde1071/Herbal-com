import { auth, currentUser } from "@clerk/nextjs/server";
import { db } from "./db";
import { Role } from "@prisma/client";

export async function isAdmin(): Promise<boolean> {
  try {
    const { userId } = await auth();
    if (!userId) return false;
    if (userId === process.env.ADMIN_CLERK_USER_ID) return true;
    const user = await db.user.findUnique({ where: { clerkId: userId } });
    return user?.role === Role.ADMIN;
  } catch {
    return false;
  }
}

export async function getCurrentDbUser() {
  try {
    const { userId } = await auth();
    if (!userId) return null;
    return await db.user.findUnique({ where: { clerkId: userId } });
  } catch {
    return null;
  }
}

export async function syncUser() {
  const clerkUser = await currentUser();
  if (!clerkUser) return null;
  const email = clerkUser.emailAddresses[0]?.emailAddress;
  if (!email) return null;
  const isAdminUser = clerkUser.id === process.env.ADMIN_CLERK_USER_ID;
  return await db.user.upsert({
    where: { clerkId: clerkUser.id },
    update: { name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() },
    create: {
      clerkId: clerkUser.id,
      email,
      name: `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim(),
      role: isAdminUser ? Role.ADMIN : Role.RETAIL,
    },
  });
}
