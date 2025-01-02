"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  Package,
  ListOrdered,
  BarChart2,
  Settings,
  Tags,
  ClipboardList,
} from "lucide-react";

const routes = [
  {
    label: "Dashboard",
    icon: LayoutDashboard,
    href: "/dashboard",
    color: "text-sky-500",
  },
  {
    label: "Products",
    icon: Package,
    href: "/dashboard/products",
    color: "text-violet-500",
  },
  {
    label: "Categories",
    icon: Tags,
    href: "/dashboard/categories",
    color: "text-pink-500",
  },
  {
    label: "Orders",
    icon: ClipboardList,
    href: "/dashboard/orders",
    color: "text-orange-500",
  },
  {
    label: "Transactions",
    icon: ListOrdered,
    href: "/dashboard/transactions",
    color: "text-yellow-500",
  },
  {
    label: "Reports",
    icon: BarChart2,
    href: "/dashboard/reports",
    color: "text-emerald-500",
  },
  {
    label: "Settings",
    icon: Settings,
    href: "/dashboard/settings",
    color: "text-gray-500",
  },
];

export function SideNav() {
  const pathname = usePathname();

  return (
    <div className="w-64 space-y-4 py-4 flex flex-col h-full bg-gray-900 text-white">
      <div className="px-3 py-2 flex-1">
        <Link href="/dashboard" className="flex items-center pl-3 mb-14">
          <h1 className="text-3xl font-bold">Arms Steel</h1>
        </Link>
        <div className="space-y-1">
          {routes.map((route) => (
            <Link
              key={route.href}
              href={route.href}
              className={cn(
                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition",
                pathname === route.href
                  ? "text-white bg-white/10"
                  : "text-zinc-400"
              )}
            >
              <div className="flex items-center flex-1">
                <route.icon className={cn("h-5 w-5 mr-3", route.color)} />
                {route.label}
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}