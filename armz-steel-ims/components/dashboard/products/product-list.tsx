'use client';

import { useState } from "react";
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
import { Edit2, Trash2, EyeOff, Eye } from "lucide-react";
import { EditProductModal } from "./edit-product-modal";
import { useProducts, toggleProductStatus } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductListProps {
  refreshKey: boolean;
}

interface LocalProduct {
  id: string;
  name: string;
  sku: string;
  categoryId: string;
  category: { id: string; name: string };
  quantity: number;
  unit: string;
  minStock: number;
  status: string;
}

export const ProductList: React.FC<ProductListProps> = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingProduct, setEditingProduct] = useState<LocalProduct | null>(null);
  const { products, loading, deleteProduct, refreshProducts } = useProducts();
  const { toast } = useToast();

  const filteredProducts = loading || !Array.isArray(products) 
    ? [] 
    : products?.filter((product) => {
        const nameMatch = product?.name?.toLowerCase().includes(searchTerm.toLowerCase());
        return nameMatch;
      }) || [];

  const handleInactive = async (product: LocalProduct) => {
    const newStatus = product.status === "inactive" ? "active" : "inactive";
    try {
      const confirmMessage = `Are you sure you want to ${newStatus === "inactive" ? "deactivate" : "activate"} ${product.name}?`;
      if (window.confirm(confirmMessage)) {
        await toggleProductStatus(product.id, newStatus);
        await refreshProducts();
        toast({
          title: "Status Updated",
          description: `${product.name} has been ${newStatus === "inactive" ? "deactivated" : "activated"} successfully.`,
          variant: "default",
        });
      }
    } catch (error) {
      console.error(`Failed to mark product as ${newStatus}:`, error);
      toast({
        variant: "destructive",
        title: "Status Update Failed",
        description: `Could not ${newStatus === "inactive" ? "deactivate" : "activate"} ${product.name}. ${error instanceof Error ? error.message : "Please try again."}`
      });
    }
  };

  const handleDelete = async (product: LocalProduct) => {
    if (product.status === "inactive") {
      toast({
        title: "Action not allowed",
        description: "Cannot delete an inactive product. Please activate it first.",
        variant: "destructive",
      });
      return;
    }

    if (window.confirm(`Are you sure you want to delete ${product.name}?`)) {
      try {
        await deleteProduct(product.id);
        await refreshProducts(); 
        toast({
          title: "Product deleted",
          description: `${product.name} has been removed from the inventory.`,
        });
      } catch (error) {
        console.error("Failed to delete product:", error);
        toast({
          variant: "destructive",
          title: "Failed to delete product",
          description: `Could not remove ${product.name} from the inventory.`,
        });
      }
    }
  };

  if (loading) {
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
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="max-w-sm"
        />
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>SKU</TableHead>
              <TableHead>Category</TableHead>
              <TableHead>Quantity</TableHead>
              <TableHead>Unit Price</TableHead>
              <TableHead>Min Stock</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProducts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={8} className="text-center py-8">
                  No products found
                </TableCell>
              </TableRow>
            ) : (
              filteredProducts.map((product) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.sku}</TableCell>
                  <TableCell>{product.category?.name}</TableCell>
                  <TableCell>{product.quantity}</TableCell>
                  <TableCell>{product.unit}</TableCell>
                  <TableCell>{product.minStock}</TableCell>
                  <TableCell>
                    <span
                      className={cn(
                        "px-3 py-1.5 rounded-full text-xs font-medium",
                        product.status === "active"
                          ? "bg-green-100 text-green-800 border border-green-200"
                          : "bg-red-100 text-red-800 border border-red-200"
                      )}
                    >
                      {product.status === "active" ? "Active" : "Inactive"}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingProduct(product)}
                        disabled={product.status === "inactive"}
                        className={cn(
                          product.status === "inactive" && "opacity-50 cursor-not-allowed"
                        )}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleInactive(product)}
                        className={cn(
                          "hover:bg-gray-100",
                          product.status === "active" 
                            ? "text-green-600 hover:text-green-700" 
                            : "text-red-600 hover:text-red-700"
                        )}
                      >
                        {product.status === "active" ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product)}
                        disabled={product.status === "inactive"}
                        className={cn(
                          product.status === "inactive" && "opacity-50 cursor-not-allowed"
                        )}
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

      {editingProduct && (
        <EditProductModal
          product={editingProduct}
          onClose={() => {
            setEditingProduct(null);
            refreshProducts();
          }}
        />
      )}
    </div>
  );
};
