"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { OrderList } from "@/components/dashboard/orders/order-list";
import { Button } from "@/components/ui/button";
import { OrderModal } from "@/components/dashboard/orders/order-modal";

export default function OrdersPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Orders</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Create Order
        </Button>
      </div>

      <OrderList />
      <OrderModal open={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}