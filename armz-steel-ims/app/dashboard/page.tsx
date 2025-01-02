import { Suspense } from "react";
import { DashboardStats } from "@/components/dashboard/dashboard-stats";
import { DashboardChart } from "@/components/dashboard/dashboard-chart";
import { LowStockAlerts } from "@/components/dashboard/low-stock-alerts";
import { DashboardSkeleton } from "@/components/dashboard/dashboard-skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function DashboardPage() {
  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
      </div>
      
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview" className="space-y-4">
          <Suspense fallback={<DashboardSkeleton />}>
            <DashboardStats />
            
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
              <div className="col-span-4">
                <DashboardChart />
              </div>
              <div className="col-span-3">
                <LowStockAlerts />
              </div>
            </div>
          </Suspense>
        </TabsContent>

        <TabsContent value="analytics">
          <div className="text-center py-10">
            <p className="text-muted-foreground">Detailed analytics coming soon...</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}