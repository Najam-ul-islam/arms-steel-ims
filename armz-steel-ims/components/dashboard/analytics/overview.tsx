"use client";

import { useEffect, useState } from "react";
import { Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface StockData {
  name: string;
  total: number;
}

export function Overview() {
  const [data, setData] = useState<StockData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchStockHistory = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/stock-history");
        if (!response.ok) {
          throw new Error("Failed to fetch stock history");
        }
        const stockData = await response.json();
        setData(stockData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch stock history:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch stock history");
      } finally {
        setLoading(false);
      }
    };

    fetchStockHistory();
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
        No stock history data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <LineChart data={data}>
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
          tickFormatter={(value) => `${value}`}
        />
        <Tooltip />
        <Line
          type="monotone"
          dataKey="total"
          stroke="#8884d8"
          strokeWidth={2}
          dot={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}
