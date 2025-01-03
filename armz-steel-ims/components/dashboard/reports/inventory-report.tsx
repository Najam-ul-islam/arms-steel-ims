"use client";

import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

export function InventoryReport() {
  interface InventoryItem {
    category: string;
    totalItems: number;
    value: string;
    // turnover: string;
  }

  const [inventoryData, setInventoryData] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchInventory() {
      try {
        
        const response = await fetch("/api/inventory");
        const data = await response.json();
        setInventoryData(data);
      } catch (error) {
        console.error("Error fetching inventory data:", error);
      } finally {
        setLoading(false);
      }
    }

    fetchInventory();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Card className="col-span-1">
      <CardHeader>
        <CardTitle>Inventory Analysis</CardTitle>
        <CardDescription>Stock levels by category</CardDescription>
      </CardHeader>
      <CardContent>
        <Table className="bg-green-50 rounded-md">
          <TableHeader>
            <TableRow >
              <TableHead className="text-md font-bold text-black">Category</TableHead>
              <TableHead className="text-md font-bold text-right text-black">Items</TableHead>
              <TableHead className="text-md font-bold text-right text-black">Value</TableHead>
              {/* <TableHead className="text-right">Turnover</TableHead> */}
            </TableRow>
          </TableHeader>
          <TableBody>
            {inventoryData.map((item) => (
              <TableRow key={item.category}>
                <TableCell >{item.category}</TableCell>
                <TableCell className="text-right">{item.totalItems}</TableCell>
                <TableCell className="text-right">{item.value}</TableCell>
                {/* <TableCell className="text-right">{item.turnover}</TableCell> */}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}