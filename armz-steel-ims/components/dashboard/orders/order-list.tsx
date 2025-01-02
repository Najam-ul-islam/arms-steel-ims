"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Edit2, Eye, Plus, Printer, Trash2 } from "lucide-react";
import { OrderModal } from "./order-modal";
import { OrderDetailsModal } from "./order-details-modal";
import { toast } from "sonner";

interface Filters {
  type: string | null;
  status: string | null;
}

type OrderType = "PURCHASE" | "SALES";
type OrderStatus = "PENDING" | "APPROVED" | "PROCESSING" | "COMPLETED" | "CANCELLED";
type BadgeVariant = "default" | "destructive" | "outline" | "secondary" | null | undefined;

interface Order {
  id: string;
  orderNumber: string;
  type: OrderType;
  status: OrderStatus;
  supplier: string | null;
  customer: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  notes?: string;
  items: Array<{
    id: string;
    productId: string;
    quantity: number;
    unitPrice: number;
    totalPrice: number;
    product: {
      name: string;
    };
  }>;
}

export function OrderList() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<Filters>({ type: null, status: null });
  const [modalState, setModalState] = useState<{
    mode: "create" | "edit" | "view" | null;
    order: Order | null;
  }>({ mode: null, order: null });
  const [isLoading, setIsLoading] = useState(true);

  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const { data } = await axios.get("/api/orders");
      // Ensure data.orders exists and is an array
      const ordersList = Array.isArray(data.orders) ? data.orders : Array.isArray(data) ? data : [];
      setOrders(ordersList);
    } catch (error: any) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to fetch orders");
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteOrder = async (orderId: number | string) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;

    try {
      await axios.delete(`/api/orders/${orderId}`);
      // console.log("order id -----------",orderId);
      setOrders((prevOrders) =>
        prevOrders.filter((order) => order.id !== orderId)
      );
      toast.success("Order deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete order");
    }
  };

  const getStatusColor = (
    status: string
  ): BadgeVariant => {
    const colors: Record<string, BadgeVariant> = {
      PENDING: "outline", // Map "warning" to "outline"
      APPROVED: "secondary",
      PROCESSING: "default",
      COMPLETED: "default", // Map "success" to "default"
      CANCELLED: "destructive",
    };
    return colors[status.toUpperCase()] || "default";
  };

  const filteredOrders = Array.isArray(orders) ? orders.filter(
    (order) =>
      order?.orderNumber?.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (filters.type === null || order.type === filters.type) &&
      (filters.status === null || order.status === filters.status)
  ) : [];

  useEffect(() => {
    fetchOrders();
  }, []);

  if (isLoading) {
    return (
      <div className="rounded-md border p-8">
        <div className="space-y-4">
          <div className="h-8 bg-gray-100 rounded animate-pulse" />
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-12 bg-gray-50 rounded animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-4">
        <Input
          placeholder="Search orders..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
        <Select
          value={filters.type || undefined}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              type: value === "all" ? null : value,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Types" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Types</SelectItem>
            <SelectItem value="PURCHASE">Purchase</SelectItem>
            <SelectItem value="SALES">Sales</SelectItem>
          </SelectContent>
        </Select>
        <Select
          value={filters.status || undefined}
          onValueChange={(value) =>
            setFilters((prev) => ({
              ...prev,
              status: value === "all" ? null : value,
            }))
          }
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="All Statuses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="PENDING">Pending</SelectItem>
            <SelectItem value="APPROVED">Approved</SelectItem>
            <SelectItem value="PROCESSING">Processing</SelectItem>
            <SelectItem value="COMPLETED">Completed</SelectItem>
            <SelectItem value="CANCELLED">Cancelled</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Order Number</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Customer/Supplier</TableHead>
              <TableHead>Total Amount</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredOrders.length === 0 ? (
              <TableRow>
                <TableCell colSpan={7} className="text-center py-4">
                  No orders found
                </TableCell>
              </TableRow>
            ) : (
              filteredOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={
                        order.type === "PURCHASE"
                          ? "bg-green-600 text-white"
                          : "bg-blue-600 text-white"
                      }
                    >
                      {order.type === "PURCHASE" ? "PURCHASE" : "SALES"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusColor(order.status)}>
                      {order.status}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {order.type === "PURCHASE" ? order.supplier : order.customer}
                  </TableCell>
                  <TableCell>Rs. {order.totalAmount}</TableCell>
                  <TableCell>
                    {new Date(order.createdAt).toLocaleDateString()}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() =>
                          setModalState({ mode: "view", order })
                        }
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                          console.log("Edit clicked", order);
                          setModalState({ mode: "edit", order });
                        }}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDeleteOrder(order.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {modalState.mode === "view" && modalState.order && (
        <OrderDetailsModal
          open={true}
          order={modalState.order}
          onClose={() => setModalState({ mode: null, order: null })}
        />
      )}

      {(modalState.mode === "create" || modalState.mode === "edit") && (
        <OrderModal
          open={true}
          mode={modalState.mode}
          order={modalState.order}
          onClose={() => {
            setModalState({ mode: null, order: null });
          }}
          onOrderSaved={() => {
            fetchOrders();
            setModalState({ mode: null, order: null });
          }}
        />
      )}
    </div>
  );
}