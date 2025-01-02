"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface Product {
  status: string;
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: {
    id: string;
    name: string;
  };
  quantity: number;
  unit: string;
  minStock: number;
  description?: string;
}

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch("/api/products");
      if (!response.ok) throw new Error("Failed to fetch products");
      const { products: data } = await response.json();
      setProducts(data || []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
      toast({
        title: "Error",
        description: "Failed to fetch products",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addProduct = async (productData: Omit<Product, "id" | "category">) => {
    try {
      
      console.log(productData)
      const response = await fetch("/api/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });

      
      if (!response.ok) throw new Error("Failed to create product");
      const newProduct = await response.json();
      setProducts((prev) => [newProduct, ...prev]);
      return newProduct;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to create product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateProduct = async (id: string, productData: Partial<Product>) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(productData),
      });
      if (!response.ok) throw new Error("Failed to update product");
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to update product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "DELETE",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to delete product");
      }
      setProducts((prev) => prev.filter((product) => product.id !== id));
    } catch (err) {
      toast({
        title: "Error",
        description: "Failed to delete product",
        variant: "destructive",
      });
      throw err;
    }
  };

  const toggleProductStatus = async (id: string, status: string) => {
    try {
      const response = await fetch(`/api/products/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status }),
      });
      
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || `Failed to update product status to ${status}`);
      }
      
      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );
      return updatedProduct;
    } catch (err) {
      toast({
        title: "Error",
        description: `Failed to update product status to ${status}`,
        variant: "destructive",
      });
      throw err;
    }
  };

  const markProductInactive = async (id: string) => {
    try {
      const response = await fetch(`/api/products?id=${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ status: "inactive" }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to update product status");
      }

      const updatedProduct = await response.json();
      setProducts((prev) =>
        prev.map((product) =>
          product.id === id ? updatedProduct : product
        )
      );

      toast({
        title: "Success",
        description: "Product marked as inactive",
      });
    } catch (err) {
      console.error("Error updating product status:", err);
      toast({
        title: "Error",
        description: err instanceof Error ? err.message : "Failed to update product status",
        variant: "destructive",
      });
      throw err;
    }
  };

  return {
    products,
    loading,
    error,
    addProduct,
    updateProduct,
    deleteProduct,
    markProductInactive,
    toggleProductStatus,
    refreshProducts: fetchProducts,
  };
}

export async function toggleProductStatus(id: string, status: string) {
  try {
    const response = await fetch(`/api/products?id=${id}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ status }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(errorText || "Failed to toggle product status");
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error toggling product status:", error);
    throw error;
  }
}