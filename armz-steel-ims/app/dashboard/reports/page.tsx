"use client";

import ReportsOverview from "@/components/dashboard/reports/reports-overview";
import { TransactionReport } from "@/components/dashboard/reports/transaction-report";
import { InventoryReport } from "@/components/dashboard/reports/inventory-report";

export default function ReportsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">Reports</h2>
      <ReportsOverview />
      <div className="grid gap-4 grid-cols-1 lg:grid-cols-2">
        <TransactionReport />
        <InventoryReport />
      </div>
    </div>
  );
}