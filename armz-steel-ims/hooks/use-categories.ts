"use client";

import { useState, useEffect } from "react";
import { toast } from "@/hooks/use-toast";

export interface Category {
  id: string;
  name: string;
  description?: string;
  _count?: {
    products: number;
  };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (!response.ok) {
        throw new Error("Failed to fetch categories");
      }
      const data = await response.json();
      setCategories(data);
      setError(null);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to fetch categories";
      setError(errorMessage);
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const addCategory = async (categoryData: Pick<Category, "name" | "description">) => {
    try {
      const response = await fetch("/api/categories", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to create category");
      }
      
      const newCategory = await response.json();
      setCategories((prev) => [newCategory, ...prev]);
      toast({
        title: "Success",
        description: `Category "${categoryData.name}" has been created`,
      });
      return newCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to create category";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const updateCategory = async (id: string, categoryData: Partial<Pick<Category, "name" | "description">>) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(categoryData),
      });
      
      if (!response.ok) {
        throw new Error("Failed to update category");
      }
      
      const updatedCategory = await response.json();
      setCategories((prev) =>
        prev.map((category) =>
          category.id === id ? updatedCategory : category
        )
      );
      toast({
        title: "Success",
        description: `Category "${categoryData.name || 'selected'}" has been updated`,
      });
      return updatedCategory;
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to update category";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
      throw err;
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json"
        }
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || "Failed to delete category");
      }

      // Update local state immediately
      setCategories((prev) => prev.filter((category) => category.id !== id));
      
      // Fetch fresh data in the background
      fetchCategories().catch(error => {
        console.error("Error refreshing categories:", error);
      });
      
      return data;
    } catch (err) {
      console.error("Delete error:", err);
      const error = err instanceof Error ? err : new Error("Failed to delete category");
      throw error;
    }
  };

  return {
    categories,
    loading,
    error,
    addCategory,
    updateCategory,
    deleteCategory,
    refreshCategories: fetchCategories,
  };
}