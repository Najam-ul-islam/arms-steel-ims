import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { useState, useEffect } from "react";

interface OrderItem {
  id: string;
  productId: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product: {
    name: string;
  };
}

interface Order {
  id: string;
  orderNumber: string;
  type: "PURCHASE" | "SALES";
  status: "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
  customer?: string;
  supplier?: string;
  totalAmount: number;
  notes?: string;
  createdAt: string;
  items: OrderItem[];
}

export function useOrders() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const response = await fetch("/api/orders");
      if (!response.ok) throw new Error("Failed to fetch orders");
      const data = await response.json();
      setOrders(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const createOrder = async (orderData: Partial<Order>) => {
    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to create order");
      const newOrder = await response.json();
      setOrders((prev) => [newOrder, ...prev]);
      return newOrder;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to create order");
    }
  };

  const updateOrder = async (id: string, orderData: Partial<Order>) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(orderData),
      });
      if (!response.ok) throw new Error("Failed to update order");
      const updatedOrder = await response.json();
      setOrders((prev) =>
        prev.map((order) => (order.id === id ? updatedOrder : order))
      );
      return updatedOrder;
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to update order");
    }
  };

  const deleteOrder = async (id: string) => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) throw new Error("Failed to delete order");
      setOrders((prev) => prev.filter((order) => order.id !== id));
    } catch (err) {
      throw err instanceof Error ? err : new Error("Failed to delete order");
    }
  };


  
  

  return {
    orders,
    loading,
    error,
    createOrder,
    updateOrder,
    deleteOrder,
    refreshOrders: fetchOrders,
  };
}
