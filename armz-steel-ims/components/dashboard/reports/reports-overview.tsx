"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Card } from "@/components/ui/card";
import { FileBarChart, PackageSearch, ArrowUpDown } from "lucide-react";

const ReportsOverview = () => {
  const [totalTransactions, setTotalTransactions] = useState("0");
  const [stockTurnover, setStockTurnover] = useState("0");
  const [inventoryValue, setInventoryValue] = useState("0");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get last 30 days transactions
        const last30DaysResponse = await axios.get("/api/orders?period=last30days");
        const totalTransactions = last30DaysResponse.data.totalOrders;
        setTotalTransactions(totalTransactions.toString());

        // Get yearly transactions and inventory value
        const [lastYearResponse, inventoryResponse] = await Promise.all([
          axios.get("/api/orders?period=lastyear"),
          axios.get("/api/products")
        ]);

        // Calculate stock turnover (Total value of goods sold / Average inventory value)
        const yearlyOrdersValue = lastYearResponse.data.totalValue || 0;
        const currentInventoryValue = inventoryResponse.data.products.reduce(
          (acc: number, product: { unit: number; quantity: number }) => 
            acc + (product.unit * product.quantity),
          0
        );
        // console.log("current invenory vallue ",currentInventoryValue);

        // Stock turnover = (Total value of goods sold) / (Average inventory value)
        // Using current inventory as average for simplicity
        const turnoverRate = currentInventoryValue > 0 
          ? (yearlyOrdersValue / currentInventoryValue).toFixed(2)
          : "0";
        
        setStockTurnover(turnoverRate);
        // console.log(turnoverRate);
        setInventoryValue(currentInventoryValue.toLocaleString());
      } catch (error) {
        console.error("Failed to fetch data:", error);
        // Keep default values on error
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      title: "Total Transactions",
      value: totalTransactions,
      description: "Last 30 days",
      icon: ArrowUpDown,
    },
    {
      title: "Stock Turnover",
      value: stockTurnover,
      description: "Times per year",
      icon: PackageSearch,
    },
    {
      title: "Inventory Value",
      value: `Rs. ${inventoryValue}`,
      description: "Current value",
      icon: FileBarChart,
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {stats.map((stat) => (
        <Card key={stat.title} className="p-6 bg-slate-800 text-white">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-white font-medium text-muted-foreground">
                {stat.title}
              </p>
              <p className="text-2xl font-bold">{loading ? "..." : stat.value}</p>
              <p className="text-xs text-white text-muted-foreground">{stat.description}</p>
            </div>
            <div className="p-2 bg-primary/5 rounded-full">
              <stat.icon className="w-6 h-6 text-primary" />
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};

export default ReportsOverview;