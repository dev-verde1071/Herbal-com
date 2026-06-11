export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { isAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import AdminCustomerList from "../AdminCustomerList";

export default async function AdminWholesaleCustomersPage() {
  const admin = await isAdmin();

  if (!admin) {
    redirect("/");
  }

  const users = await db.user.findMany({
    where: {
      wholesaleApplications: {
        some: {
          status: "APPROVED",
          archived: false,
        },
      },
    },
    include: {
      orders: {
        where: {
          orderType: "WHOLESALE",
        },
        include: {
          items: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      },
      wholesaleApplications: {
        where: {
          status: "APPROVED",
          archived: false,
        },
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
            Admin / Wholesale
          </p>

          <h1 className="font-display text-5xl">
            Wholesale Customers
          </h1>

          <p className="text-zinc-400 mt-3">
            View approved wholesale customers, saved wholesale carts, contact
            information, and wholesale order history.
          </p>
        </div>

        <AdminCustomerList users={users as any} />
      </div>
    </div>
  );
}
