"use client";

import { useState, useEffect } from "react";
import { Plus, Search, FileDown, Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TransactionTable } from "@/components/dashboard/transactions/transaction-table";

export default function TransactionsPage() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  interface Transaction {
    id: number;
    orderNumber: string;
    data: string;
    type: string;
  }

  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [filteredTransactions, setFilteredTransactions] = useState<Transaction[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [transactionType, setTransactionType] = useState("all");

  useEffect(() => {
    // Fetch transactions from the API or database
    async function fetchTransactions() {
      const response = await fetch("/api/orders"); // Replace with your API endpoint
      const data = await response.json();
      setTransactions(data);
      setFilteredTransactions(data);
    }

    fetchTransactions();
  }, []);

  useEffect(() => {
    // Filter transactions based on search query and type
    const filtered = transactions.filter((transaction) => {
      const matchesSearch = searchQuery
        ? transaction.orderNumber.includes(searchQuery) ||
          transaction.data.toLowerCase().includes(searchQuery.toLowerCase())
        : true;

      const matchesType =
        transactionType === "all"
          ? true
          : transactionType === "inbound"
          ? transaction.type === "Purchase"
          : transaction.type === "Sales";

      return matchesSearch && matchesType;
    });

    setFilteredTransactions(filtered);
  }, [searchQuery, transactionType, transactions]);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Transactions</h2>
        {/* Uncomment to use Add Transaction Dialog */}
        {/* <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Transaction
        </Button> */}
      </div>

      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search transactions..."
              className="pl-8"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        <Select
          defaultValue="all"
          onValueChange={(value) => setTransactionType(value)}
        >
          <SelectTrigger className="w-[180px]">
            <Filter className="mr-2 h-4 w-4" />
            <SelectValue placeholder="Transaction Type" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Transactions</SelectItem>
            <SelectItem value="inbound">Purchase</SelectItem>
            <SelectItem value="outbound">Sales</SelectItem>
          </SelectContent>
        </Select>
        <Button variant="outline">
          <FileDown className="mr-2 h-4 w-4" />
          Export
        </Button>
      </div>

      <TransactionTable
        transactions={filteredTransactions}
        onTransactionUpdate={(updatedTransaction: Transaction) => {
          setTransactions((prev) =>
        prev.map((transaction) =>
          transaction.id === updatedTransaction.id
            ? updatedTransaction
            : transaction
        )
          );
        }}
      />

      {/* Uncomment to use Add Transaction Dialog */}
      {/* <AddTransactionDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        onSuccess={(newTransaction) => {
          setTransactions((prev) => [...prev, newTransaction]);
        }}
      /> */}
    </div>
  );
}