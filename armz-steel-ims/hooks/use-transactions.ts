"use client";

import { useState, useCallback } from 'react';
import axios from 'axios';
// import { toast } from 'sonner';

import { toast } from "@/hooks/use-toast";

export type TransactionType = 'INBOUND' | 'OUTBOUND' | 'ADJUSTMENT';

export interface Transaction {
  id: string;
  type: TransactionType;
  productId: string;
  product: {
    id: string;
    name: string;
    sku: string;
  };
  quantity: number;
  notes?: string;
  reference: string;
  createdAt: string;
}

export interface CreateTransactionDTO {
  type: TransactionType;
  productId: string;
  quantity: number;
  reference: string;
  notes?: string;
}

export interface UpdateTransactionDTO extends CreateTransactionDTO {
  id: string;
}

export function useTransactions() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // const fetchTransactions = useCallback(async () => {
  //   try {
  //     setIsLoading(true);
  //     setError(null);
  //     const response = await axios.get('/api/transactions');
  //     setTransactions(response.data);
  //   } catch (err) {
  //     const errorMessage = axios.isAxiosError(err) 
  //       ? err.response?.data?.message || err.message
  //       : 'Failed to fetch transactions';
  //     setError(errorMessage);
  //     toast.error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const data = await response.json();
      setTransactions(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  // const createTransaction = useCallback(async (data: CreateTransactionDTO) => {
  //   try {
  //     console.log('Create Transaction line 60--------------------------------');
  //     setIsLoading(true);
  //     const response = await axios.post('/api/transactions', data);
  //     setTransactions(prev => [...prev, response.data]);
  //     toast.success('Transaction created successfully');
  //     return response.data;
  //   } catch (err) {
  //     const errorMessage = axios.isAxiosError(err)
  //       ? err.response?.data?.message || err.message
  //       : 'Failed to create transaction';
  //     toast.error(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // const updateTransaction = useCallback(async (data: UpdateTransactionDTO) => {
  //   try {
  //     setIsLoading(true);
  //     const response = await axios.put(`/api/transactions/${data.id}`, data);
  //     setTransactions(prev => 
  //       prev.map(transaction => 
  //         transaction.id === data.id ? response.data : transaction
  //       )
  //     );
  //     toast.success('Transaction updated successfully');
  //     return response.data;
  //   } catch (err) {
  //     const errorMessage = axios.isAxiosError(err)
  //       ? err.response?.data?.message || err.message
  //       : 'Failed to update transaction';
  //     toast.error(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  // const deleteTransaction = useCallback(async (id: string) => {
  //   try {
  //     setIsLoading(true);
  //     await axios.delete(`/api/transactions/${id}`);
  //     setTransactions(prev => prev.filter(transaction => transaction.id !== id));
  //     toast.success('Transaction deleted successfully');
  //   } catch (err) {
  //     const errorMessage = axios.isAxiosError(err)
  //       ? err.response?.data?.message || err.message
  //       : 'Failed to delete transaction';
  //     toast.error(errorMessage);
  //     throw new Error(errorMessage);
  //   } finally {
  //     setIsLoading(false);
  //   }
  // }, []);

  return {
    transactions,
    isLoading,
    error,
    fetchTransactions,
    // createTransaction,
    // updateTransaction,
    // deleteTransaction
  };
}















