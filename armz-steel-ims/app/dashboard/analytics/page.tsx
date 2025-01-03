"use client";

import { Card } from "@/components/ui/card";
import { AnalyticsDashboard } from "@/components/dashboard/analytics/analytics-dashboard";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";

export default function AnalyticsPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <Heading
          title="Analytics"
          description="Overview of your inventory analytics and insights"
        />
      </div>
      <Separator />
      <AnalyticsDashboard />
    </div>
  );
}
