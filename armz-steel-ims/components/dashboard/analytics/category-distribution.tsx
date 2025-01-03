"use client";

import { useEffect, useState } from "react";
import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip, Legend } from "recharts";
import { Skeleton } from "@/components/ui/skeleton";

interface CategoryData {
  name: string;
  value: number;
}

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884D8"];

export function CategoryDistribution() {
  const [data, setData] = useState<CategoryData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCategoryDistribution = async () => {
      try {
        setLoading(true);
        const response = await fetch("/api/analytics/category-distribution");
        if (!response.ok) {
          throw new Error("Failed to fetch category distribution");
        }
        const distributionData = await response.json();
        setData(distributionData);
        setError(null);
      } catch (error) {
        console.error("Failed to fetch category distribution:", error);
        setError(error instanceof Error ? error.message : "Failed to fetch category distribution");
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryDistribution();
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
        No category distribution data available
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={350}>
      <PieChart>
        <Pie
          data={data}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          fill="#8884d8"
          paddingAngle={5}
          dataKey="value"
          label
        >
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </ResponsiveContainer>
  );
}
