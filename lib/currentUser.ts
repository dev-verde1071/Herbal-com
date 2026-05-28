import { currentUser } from "@clerk/nextjs/server";
import { db } from "@/lib/db";

export async function getOrCreateDbUser() {
  const clerkUser = await currentUser();

  if (!clerkUser) return null;

  const email = clerkUser.emailAddresses?.[0]?.emailAddress;

  if (!email) return null;

  const name =
    [clerkUser.firstName, clerkUser.lastName].filter(Boolean).join(" ") ||
    clerkUser.username ||
    email;

  const existing = await db.user.findUnique({
    where: {
      clerkId: clerkUser.id,
    },
  });

  if (existing) {
    return db.user.update({
      where: {
        clerkId: clerkUser.id,
      },
      data: {
        email,
        name,
      },
    });
  }

  return db.user.create({
    data: {
      id: clerkUser.id,
      clerkId: clerkUser.id,
      email,
      name,
    },
  });
}
