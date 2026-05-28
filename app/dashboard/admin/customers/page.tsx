export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminCustomerList from "./AdminCustomerList";

export default async function AdminCustomersPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const users = await db.user.findMany({
    include: {
      orders: {
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      wholesaleApplications: {
        orderBy: {
          createdAt: "desc",
        },
      },
      carts: {
        include: {
          items: {
            include: {
              product: true,
              variant: true,
            },
          },
        },
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });

  return (
    <div className="min-h-screen py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="mb-10">
          <p className="uppercase tracking-[0.3em] text-jungle-300 text-xs mb-4">
            Admin
          </p>

          <h1 className="font-display text-5xl">
            Customers
          </h1>

          <p className="text-zinc-400 mt-3">
            View retail customers, wholesale customers, saved carts, order
            history, and wholesale application status.
          </p>
        </div>

        <AdminCustomerList users={users as any} />
      </div>
    </div>
  );
}
