"use client";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Eye, Printer } from "lucide-react";
import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

type Order = {
  id: string;
  date: string;
  type: string;
  orderNumber: number;
  totalAmount: number;
  createdAt: string;
};

export function TransactionTable() {
  const [transactions, setTransactions] = useState<Order[]>([]);
  const [loading, setLoading] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Order | null>(null);
  const [printMode, setPrintMode] = useState(false);

  useEffect(() => {
    const fetchTransactions = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/transaction", { method: "GET" });
        if (!response.ok) {
          throw new Error("Failed to fetch transactions");
        }
        const data = await response.json();
        setTransactions(data);
      } catch (error: any) {
        toast({
          title: "Error",
          description: error.message || "Failed to load transactions.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  const handlePrint = () => {
    setPrintMode(true);

    setTimeout(() => {
      window.print(); // Trigger the print action.
      setPrintMode(false); // Reset the print mode.
    }, 0);
  };

  return (
    <div className="rounded-md border">
      {loading ? (
        <div className="p-4 text-center">Loading transactions...</div>
      ) : (
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Order Number</TableHead>
              <TableHead>Total Amount(PKR)</TableHead>
              <TableHead className="w-[150px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.length > 0 ? (
              transactions.map((order) => (
                <TableRow key={order.id}>
                  <TableCell>{order.createdAt.slice(0, 10)}</TableCell>
                  <TableCell>
                  <Badge
                      className={
                        order.type === "PURCHASE"
                          ? "bg-green-600 text-white"
                          : "bg-blue-500 text-white"
                      }
                    >
                      {order.type}
                    </Badge>
                  </TableCell>
                  <TableCell>{order.orderNumber}</TableCell>
                  <TableCell>Rs.{order.totalAmount}</TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => setSelectedTransaction(order)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedTransaction(order);
                          handlePrint();
                        }}
                      >
                        <Printer className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} className="text-center">
                  No transactions found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      )}

      {/* View / Print Dialog */}
      {selectedTransaction && !printMode && (
        <Dialog open={!!selectedTransaction} onOpenChange={() => setSelectedTransaction(null)}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Transaction Details</DialogTitle>
            </DialogHeader>
<div className="space-y-2">
  <table className="table-auto w-full">
    <tbody>
      <tr>
        <td className="border px-4 py-2"><strong>ID:</strong></td>
        <td className="border px-4 py-2">{selectedTransaction.id}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2"><strong>Date:</strong></td>
        <td className="border px-4 py-2">{selectedTransaction.createdAt.slice(0, 10)}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2"><strong>Type:</strong></td>
        <td className="border px-4 py-2">{selectedTransaction.type}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2"><strong>Order Number:</strong></td>
        <td className="border px-4 py-2">{selectedTransaction.orderNumber}</td>
      </tr>
      <tr>
        <td className="border px-4 py-2"><strong>Total Amount:</strong></td>
        <td className="border px-4 py-2">{selectedTransaction.totalAmount}</td>
      </tr>
    </tbody>
  </table>
</div>
            
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handlePrint}>
                Print
              </Button>
              <Button variant="outline" onClick={() => setSelectedTransaction(null)}>
                Close
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Print Mode Dialog */}
      {printMode && selectedTransaction && (
        <div
          className="fixed inset-0 bg-white z-50 flex items-center justify-center print:block"
          style={{ display: "print" }}
        >
          <div className="p-8">
            <h1 className="text-lg font-bold mb-4">Transaction Details</h1>
            <p>
              <strong>ID:</strong> {selectedTransaction.id}
            </p>
            <p>
              <strong>Date:</strong> {selectedTransaction.createdAt.slice(0, 10)}
            </p>
            <p>
              <strong>Type:</strong> {selectedTransaction.type}
            </p>
            <p>
              <strong>Order Number:</strong> {selectedTransaction.orderNumber}
            </p>
            <p>
              <strong>Total Amount:</strong> {selectedTransaction.totalAmount}
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
