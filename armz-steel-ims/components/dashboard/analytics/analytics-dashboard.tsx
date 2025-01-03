"use client";

import { Card } from "@/components/ui/card";
import { Overview } from "@/components/dashboard/analytics/overview";
import { StockStatus } from "@/components/dashboard/analytics/stock-status";
import { CategoryDistribution } from "@/components/dashboard/analytics/category-distribution";
import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { 
  Package2,
  LayoutGrid,
  AlertTriangle,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

export interface AnalyticsData {
  totalProducts: number;
  totalCategories: number;
  stockAnalysis: {
    lowStockItems: number;
    optimalStockItems: number;
    overStockItems: number;
    stockHealth: number;
  };
  stockDistribution: {
    lowStock: number;
    optimal: number;
    overStock: number;
  };
}

function MetricSkeleton() {
  return (
    <Card className="p-4">
      <div className="space-y-2">
        <Skeleton className="h-4 w-[120px]" />
        <Skeleton className="h-8 w-[60px]" />
      </div>
    </Card>
  );
}

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 }
};

export function AnalyticsDashboard() {
  const [data, setData] = useState<AnalyticsData>({
    totalProducts: 0,
    totalCategories: 0,
    stockAnalysis: {
      lowStockItems: 0,
      optimalStockItems: 0,
      overStockItems: 0,
      stockHealth: 0,
    },
    stockDistribution: {
      lowStock: 0,
      optimal: 0,
      overStock: 0,
    },
  });

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalytics = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics");
        if (!response.ok) {
          throw new Error("Failed to fetch analytics data");
        }
        const analyticsData = await response.json();
        setData(analyticsData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch analytics:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch analytics");
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  if (error) {
    return (
      <motion.div 
        className="p-6 text-center bg-red-50 rounded-lg border border-red-200"
        {...fadeInUp}
      >
        <AlertTriangle className="h-8 w-8 text-red-500 mx-auto mb-2" />
        <p className="text-red-600">Error loading analytics: {error}</p>
      </motion.div>
    );
  }

  const getHealthColor = (health: number) => {
    if (health >= 70) return "bg-green-500";
    if (health >= 40) return "bg-yellow-500";
    return "bg-red-500";
  };

  return (
    <div className="space-y-6 p-6 bg-gray-50 rounded-lg">
      <div className="grid gap-6 md:grid-cols-3">
        {loading ? (
          <>
            <MetricSkeleton />
            <MetricSkeleton />
            <MetricSkeleton />
          </>
        ) : (
          <>
            <motion.div {...fadeInUp} transition={{ delay: 0.1 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Active Products
                    </p>
                    <div className="flex items-center gap-2">
                      <Package2 className="h-5 w-5 text-blue-500" />
                      <p className="text-3xl font-bold text-blue-600">{data.totalProducts}</p>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-blue-50 rounded-full flex items-center justify-center">
                    <Package2 className="h-6 w-6 text-blue-500" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.2 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-muted-foreground mb-1">
                      Categories
                    </p>
                    <div className="flex items-center gap-2">
                      <LayoutGrid className="h-5 w-5 text-green-500" />
                      <p className="text-3xl font-bold text-green-600">{data.totalCategories}</p>
                    </div>
                  </div>
                  <div className="h-12 w-12 bg-green-50 rounded-full flex items-center justify-center">
                    <LayoutGrid className="h-6 w-6 text-green-500" />
                  </div>
                </div>
              </Card>
            </motion.div>

            <motion.div {...fadeInUp} transition={{ delay: 0.3 }}>
              <Card className="p-6 hover:shadow-lg transition-shadow duration-200">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-muted-foreground">
                      Stock Health
                    </p>
                    <div className={cn(
                      "h-8 w-8 rounded-full flex items-center justify-center",
                      data.stockAnalysis.stockHealth >= 70 ? "bg-green-50" :
                      data.stockAnalysis.stockHealth >= 40 ? "bg-yellow-50" : "bg-red-50"
                    )}>
                      {data.stockAnalysis.stockHealth >= 70 ? (
                        <CheckCircle2 className="h-5 w-5 text-green-500" />
                      ) : data.stockAnalysis.stockHealth >= 40 ? (
                        <AlertCircle className="h-5 w-5 text-yellow-500" />
                      ) : (
                        <AlertTriangle className="h-5 w-5 text-red-500" />
                      )}
                    </div>
                  </div>
                  <p className="text-3xl font-bold">
                    {data.stockAnalysis.stockHealth}%
                  </p>
                  <Progress 
                    value={data.stockAnalysis.stockHealth} 
                    className={`${getHealthColor(data.stockAnalysis.stockHealth)} h-2`}
                  />
                  <div className="grid grid-cols-3 gap-2 text-xs">
                    <div className="text-red-600">
                      Low: {data.stockDistribution.lowStock}%
                    </div>
                    <div className="text-center text-green-600">
                      Optimal: {data.stockDistribution.optimal}%
                    </div>
                    <div className="text-right text-yellow-600">
                      Over: {data.stockDistribution.overStock}%
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.4 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <TrendingUp className="h-5 w-5 text-blue-500" />
                    Stock Level Trends
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Monthly stock level changes across your inventory
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <Overview />
            </div>
          </Card>
        </motion.div>

        <motion.div 
          {...fadeInUp}
          transition={{ delay: 0.5 }}
        >
          <Card className="overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-lg font-semibold flex items-center gap-2">
                    <Package2 className="h-5 w-5 text-green-500" />
                    Stock Status by Category
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    In-stock vs low-stock items per category
                  </p>
                </div>
              </div>
            </div>
            <div className="p-6">
              <StockStatus />
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div 
        {...fadeInUp}
        transition={{ delay: 0.6 }}
      >
        <Card className="overflow-hidden">
          <div className="p-6 border-b">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold flex items-center gap-2">
                  <LayoutGrid className="h-5 w-5 text-purple-500" />
                  Product Distribution
                </h3>
                <p className="text-sm text-muted-foreground mt-1">
                  How your products are distributed across categories
                </p>
              </div>
            </div>
          </div>
          <div className="p-6">
            <CategoryDistribution />
          </div>
        </Card>
      </motion.div>
    </div>
  );
}
