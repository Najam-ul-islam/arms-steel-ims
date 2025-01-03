"use client";

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
import { Edit2, Trash2 } from "lucide-react";
import { CategoryModal } from "./category-modal";
import { CategoryDetail } from "./category-detail";
import { useCategories, Category } from "@/hooks/use-categories";
import { useToast } from "@/hooks/use-toast";

export function CategoryList() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const { categories, loading, deleteCategory } = useCategories();
  const { toast } = useToast();

  const filteredCategories = categories.filter((category) =>
    category.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (category: Category) => {
    let confirmMessage = `Are you sure you want to delete ${category.name}?`;
    
    if (category._count && category._count.products > 0) {
      confirmMessage = `${category.name} has ${category._count.products} product(s). These products will be uncategorized. Do you want to continue?`;
    }

    if (window.confirm(confirmMessage)) {
      try {
        setSelectedCategory(null);
        setEditingCategory(null);
        
        const result = await deleteCategory(category.id);
        
        toast({
          title: "Success",
          description: result.message || `${category.name} has been deleted`,
        });
      } catch (error) {
        console.error("Delete error:", error);
        toast({
          title: "Error",
          description: error instanceof Error ? error.message : "Failed to delete category",
          variant: "destructive",
        });
      }
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <Input
          placeholder="Search categories..."
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
              <TableHead>Description</TableHead>
              <TableHead>Products</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCategories.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="text-center py-8">
                  No categories found
                </TableCell>
              </TableRow>
            ) : (
              filteredCategories.map((category) => (
                <TableRow key={category.id}>
                  <TableCell 
                    className="font-medium cursor-pointer hover:text-blue-600"
                    onClick={() => setSelectedCategory(category)}
                  >
                    {category.name}
                  </TableCell>
                  <TableCell>{category.description}</TableCell>
                  <TableCell>{category._count ? category._count.products : 0}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => setEditingCategory(category)}
                      >
                        <Edit2 className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(category)}
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

      {selectedCategory && (
        <CategoryDetail 
          category={selectedCategory} 
          onClose={() => setSelectedCategory(null)} 
        />
      )}

      {editingCategory && (
        <CategoryModal
          open={!!editingCategory}
          onOpenChange={(open) => {
            if (!open) setEditingCategory(null);
          }}
          category={editingCategory}
        />
      )}
    </div>
  );
}