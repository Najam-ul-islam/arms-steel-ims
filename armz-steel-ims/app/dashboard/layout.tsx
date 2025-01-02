"use client";

import { SideNav } from "@/components/dashboard/side-nav";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen">
      <SideNav />
      <div className="flex-1 overflow-y-auto">
        {children}
      </div>
    </div>
  );
}