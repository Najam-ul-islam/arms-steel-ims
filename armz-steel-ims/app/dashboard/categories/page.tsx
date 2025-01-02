"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { CategoryList } from "@/components/dashboard/categories/category-list";
import { Button } from "@/components/ui/button";
import { CategoryModal } from "@/components/dashboard/categories/category-modal";

export default function CategoriesPage() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center justify-between">
        <h2 className="text-3xl font-bold tracking-tight">Categories</h2>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Add Category
        </Button>
      </div>

      <CategoryList />
      <CategoryModal 
        open={isModalOpen} 
        onOpenChange={setIsModalOpen}
      />
    </div>
  );
}