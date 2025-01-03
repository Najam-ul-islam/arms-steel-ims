"use client";

import { useEffect, useState } from "react";
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Tooltip } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryStock {
  name: string;
  inStock: number;
  lowStock: number;
}

export function StockStatus() {
  const [data, setData] = useState<CategoryStock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockStatus = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/stock-status");
        if (!response.ok) {
          throw new Error("Failed to fetch stock status");
        }
        const stockData = await response.json();
        setData(stockData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch stock status:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch stock status");
      } finally {
        setLoading(false);
      }
    };

    fetchStockStatus();
  }, []);

  if (loading) {
    return (
      <div className="h-[350px] flex items-center justify-center">
        <Skeleton className="h-[300px] w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="h-[350px] flex items-center justify-center text-red-500">
        {error}
      </div>
    );
  }

  if (!data.length) {
    return (
      <div className="h-[350px] flex items-center justify-center text-muted-foreground">
        No stock status data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={data}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip />
        <Bar dataKey="inStock" fill="#8884d8" stackId="stack" name="In Stock" />
        <Bar dataKey="lowStock" fill="#ff0000" stackId="stack" name="Low Stock" />
      </BarChart>
    </ResponsiveContainer>
  );
}
