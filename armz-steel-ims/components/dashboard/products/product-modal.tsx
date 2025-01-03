"use client";
import { useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useProducts, Product } from "@/hooks/use-products";
import { useToast } from "@/hooks/use-toast";
import { useCategories } from "@/hooks/use-categories";

// Form validation schema
const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  sku: z.string().min(1, "SKU is required"),
  categoryId: z.string().min(1, "Category is required"),
  quantity: z.number().min(0.0, "Quantity must be non-negative"),
  unit: z.string().min(1, "Unit is required"),
  minStock: z.number().min(0, "Minimum stock must be non-negative"),
  description: z.string().optional(),
});

interface ProductModalProps {
  children: React.ReactNode;
  product?: Product | null;
  open: boolean;  
  onClose: () => void;  
}

export function ProductModal({ children, product, open, onClose }: ProductModalProps) {
  const [isOpen, setOpen] = useState(false);
  const { addProduct, updateProduct } = useProducts();
  const { categories } = useCategories();
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: product
      ? {
          ...product,
          categoryId: product.category.id,
        }
      : {
          name: "",
          sku: "",
          categoryId: "",
          quantity: 0.0,
          unit: "",
          minStock: 0,
          description: "",
        },
  });

  const handleNumberInput = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void
  ) => {
    const numericValue = parseInt(e.target.value, 10);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  const onSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      if (product) {
        await updateProduct(product.id, data);
        toast({
          title: "Product updated",
          description: `${data.name} has been updated successfully.`,
        });
      } else {
        await addProduct({ ...data, status: "active" });
        toast({
          title: "Product added",
          description: `${data.name} has been added to the inventory.`,
        });
      }
      form.reset();
      // setOpen(false);
      onClose();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save product. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <>
    <div onClick={() => setOpen(true)}>{children}</div>
    <Dialog open={isOpen} onOpenChange={setOpen}>
      <DialogContent
        className="sm:max-w-[425px]"
        aria-label={product ? "Edit Product Modal" : "Add New Product Modal"}
      >
        <DialogHeader>
          <DialogTitle>
            {product ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="sku"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>SKU</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="categoryId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories?.map((category) => (
                        <SelectItem key={category.id} value={category.id}>
                          {category.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Quantity</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step= "0.1"
                      value={field.value}
                      onChange={(e) => handleNumberInput(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit Price</FormLabel>
                  <FormControl>
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="minStock"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Minimum Stock</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="0"
                      step="0.1"
                      value={field.value}
                      onChange={(e) => handleNumberInput(e, field.onChange)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  </>
  );
}