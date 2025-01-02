"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

interface ChartData {
  date: string;
  sales: number;
  purchase: number;
}

export function TransactionReport() {
  const [chartData, setChartData] = useState<ChartData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchChartData() {
      try {
        const response = await fetch("/api/reports");
        if (!response.ok) {
          throw new Error("Failed to fetch report data");
        }
        const data = await response.json();
        setChartData(data.chartData);
      } catch (error) {
        console.error("Failed to fetch chart data:", error);
        setError("Failed to load transaction data");
      } finally {
        setLoading(false);
      }
    }

    fetchChartData();
  }, []);

  if (loading) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Monthly transaction volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <div className="flex flex-col items-center space-y-4">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              <p className="text-sm text-muted-foreground">
                Loading transaction data...
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="col-span-1">
        <CardHeader>
          <CardTitle>Transaction History</CardTitle>
          <CardDescription>Monthly transaction volume</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-sm text-destructive">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Transaction History</CardTitle>
        <CardDescription>Monthly transaction volume</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={chartData}
              margin={{ top: 10, right: 20, left: 10, bottom: 5 }}
            >
              <CartesianGrid
                stroke="black" // Grid lines in black
                strokeDasharray="3 3"
              />
              <XAxis
                dataKey="date"
                stroke="black" // Black color for X-axis
                fontSize={12}
                tickLine={false}
                axisLine={true} // Black axis line
              />
              <YAxis
                stroke="black" // Black color for Y-axis
                fontSize={12}
                tickLine={false}
                axisLine={true} // Black axis line
                tickFormatter={(value) => `Rs. ${value.toLocaleString()}`}
              />
              <Tooltip
                formatter={(value: number) => [
                  `Rs. ${value.toLocaleString()}`,
                  "",
                ]}
                contentStyle={{
                  backgroundColor: "hsl(var(--background))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "6px",
                  padding: "8px",
                }}
                labelStyle={{ color: "hsl(var(--foreground))" }}
              />
              <Legend verticalAlign="top" height={36} />
              <Line
                name="Sales"
                type="monotone"
                dataKey="sales"
                stroke="#ff5733" // Bright red-orange
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#ff5733" }}
              />
              <Line
                name="Purchases"
                type="monotone"
                dataKey="purchase"
                stroke="#00b8d9" // Vibrant cyan
                strokeWidth={3}
                dot={false}
                activeDot={{ r: 6, strokeWidth: 0, fill: "#00b8d9" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}