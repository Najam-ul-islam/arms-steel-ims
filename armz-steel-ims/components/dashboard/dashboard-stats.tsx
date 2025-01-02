"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Package2, AlertCircle, DollarSign } from "lucide-react";

interface DashboardStats {
  totalActiveProducts: number;
  lowStockItems: number;
  salesAmountToday: number;
  purchasedAmountToday: number;
}

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch("/api/dashboard");
        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(errorData.error || "Failed to fetch dashboard stats");
        }
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (err: any) {
        console.error("Error fetching dashboard stats:", err);
        setError(err.message || "An error occurred.");
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="p-6">
            <div className="flex items-center space-x-2">
              <div className="h-4 w-4 animate-pulse bg-gray-200 rounded" />
              <div className="h-4 w-24 animate-pulse bg-gray-200 rounded" />
            </div>
            <div className="mt-4">
              <div className="h-8 w-16 animate-pulse bg-gray-200 rounded" />
            </div>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!stats) {
    return <div>No data available.</div>;
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card className="p-6 bg-slate-800 text-white">
        <div className="flex items-center space-x-2">
          <Package2 className="h-4 w-4 text-muted-foreground" />
          <h3 className="text-xl font-medium">Total Active Products</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.totalActiveProducts}</p>
        </div>
      </Card>

      <Card className="p-6 bg-slate-800 text-white">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 text-destructive" />
          <h3 className="text-xl font-medium">Low Stock Items</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">{stats.lowStockItems}</p>
        </div>
      </Card>

      <Card className="p-6 bg-slate-800 text-white">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-green-500" />
          <h3 className="text-xl font-medium">Today&apos;s Sales</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">Rs. {stats.salesAmountToday.toFixed(2)}</p>
        </div>
      </Card>

      <Card className="p-6 bg-slate-800 text-white">
        <div className="flex items-center space-x-2">
          <DollarSign className="h-4 w-4 text-blue-500" />
          <h3 className="text-xl font-medium">Today&apos;s Purchases</h3>
        </div>
        <div className="mt-4">
          <p className="text-2xl font-bold">Rs. {stats.purchasedAmountToday.toFixed(2)}</p>
        </div>
      </Card>
    </div>
  );
}