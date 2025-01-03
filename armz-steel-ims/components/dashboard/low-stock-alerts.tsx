'use client';

import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import axios from "axios";
import { useState, useEffect } from 'react';

interface Product {
  id: string;
  name: string;
  quantity: number;
  minStock: number;
  status: string;
}

export function LowStockAlerts() {
  const [lowStockItems, setLowStockItems] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLowStockItems = async () => {
      try {
        const response = await axios.get('/api/products');
        const products = response.data.products || [];
        const filteredItems = products.filter((item: Product) => 
          item.status === 'active' && item.quantity <= (item.minStock || 0)
        );
        setLowStockItems(filteredItems);
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          setError(error.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchLowStockItems();
  }, []);

  if (loading) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        </div>
        <div className="mt-4">Loading...</div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        </div>
        <div className="mt-4 text-destructive">Error: {error}</div>
      </Card>
    );
  }

  if (lowStockItems.length === 0) {
    return (
      <Card className="p-6">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        </div>
        <div className="mt-4 text-muted-foreground">No low stock items</div>
      </Card>
    );
  }

  return (
    <Card className="p-6 bg-slate-200">
      <div className="flex flex-col space-y-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-destructive" />
          <h3 className="text-lg font-medium">Low Stock Alerts</h3>
        </div>
        <div className="space-y-4">
          {lowStockItems.map((item) => (
            <div
              key={item.id}
              className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
            >
              <div>
                <p className="font-medium">{item.name}</p>
                <p className="text-sm text-muted-foreground">
                  Min. Stock: {item.minStock || 0}
                </p>
              </div>
              <div className="text-right">
                <p className="text-destructive font-medium">{item.quantity}</p>
                <p className="text-sm text-muted-foreground">Current Stock</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Card>
  );
}