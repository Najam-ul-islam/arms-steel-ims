"use client";

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import axios from "axios";
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
import { Textarea } from "@/components/ui/textarea";
import { Plus, Trash2 } from "lucide-react";
//  import { toast } from "sonner";
import { useToast,toast } from "@/hooks/use-toast";

interface Product {
  id: string;
  name: string;
  price: number;
  status: string;
}

const orderSchema = z.object({
  type: z.enum(["PURCHASE", "SALES"]),
  customerSupplier: z.string().min(1, "Customer/Supplier is required"),
  status: z.enum([
    "PENDING",
    "APPROVED",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
  ]),
  items: z
    .array(
      z.object({
        productId: z.string().min(1, "Product is required"),
        quantity: z.number().min(1, "Quantity must be positive"),
        unitPrice: z.number().min(0, "Unit price must be positive"),
      })
    )
    .min(1, "At least one item is required"),
  notes: z.string().optional(),
});

interface OrderModalProps {
  open: boolean;
  onClose: () => void;
  order?: any;
  onOrderSaved?: () => void;
  mode?: 'create' | 'edit';
}

export function OrderModal({
  open,
  onClose,
  order,
  onOrderSaved,
  mode = 'create'
}: OrderModalProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Format order data for the form
  const getDefaultValues = () => {
    if (mode === 'edit' && order) {
      return {
        type: order.type,
        customerSupplier: order.type === 'PURCHASE' ? order.supplier : order.customer,
        status: order.status,
        items: order.items.map((item: any) => ({
          productId: item.productId.toString(),
          quantity: item.quantity,
          unitPrice: item.unitPrice
        })),
        notes: order.notes || ''
      };
    }
    
    return {
      type: "PURCHASE",
      customerSupplier: "",
      status: "PENDING",
      items: [{ productId: "", quantity: 1, unitPrice: 0 }],
      notes: "",
    };
  };

  const form = useForm<z.infer<typeof orderSchema>>({
    resolver: zodResolver(orderSchema),
    defaultValues: getDefaultValues(),
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "items",
  });

  // Reset form when order changes
  useEffect(() => {
    if (open) {
      form.reset(getDefaultValues());
    }
  }, [open, order]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get("/api/products");
        // Only show active products in the dropdown
        const activeProducts = response.data.products.filter(
          (product: Product) => product.status === "active"
        );
        setProducts(activeProducts);
      } catch (error) {
        console.error("Failed to fetch products:", error);
        toast({
          variant: "destructive",
          title: "Error",
          description: "Failed to load products. Please try again.",
        });
      }
    };

    if (open) {
      fetchProducts();
    }
  }, [open]);

  const handleSubmit = async (data: z.infer<typeof orderSchema>) => {
    setIsSubmitting(true);
    try {
      const method = mode === 'edit' ? "PATCH" : "POST";
      const url = `/api/orders${mode === 'edit' ? `/${order.id}` : ""}`;
      
      // Format the data
      const formattedData = {
        ...data,
        type: data.type.toUpperCase(),
        [data.type === 'PURCHASE' ? 'supplier' : 'customer']: data.customerSupplier,
        items: data.items.map(item => ({
          ...item,
          quantity: Number(item.quantity),
          unitPrice: Number(item.unitPrice)
        }))
      };

      const response = await axios({
        method,
        url,
        data: formattedData,
      });
      
      if (response.status === 200 || response.status === 201) {
        toast({
          title: "Success",
          description: mode === 'edit' ? "Order updated successfully" : "Order created successfully",
        });
        onOrderSaved?.();
        onClose();
      }
    } catch (error: any) {
      console.error("Failed to save order:", error);
      const errorMessage = error.response?.data?.error || error.message || "Failed to save order";
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const handleNumericChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    onChange: (value: number) => void,
    allowFloat = false
  ) => {
    const value = e.target.value;
    const numericValue = allowFloat ? parseFloat(value) : parseInt(value, 10);
    onChange(isNaN(numericValue) ? 0 : numericValue);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>{mode === 'edit' ? "Edit Order" : "Create New Order"}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Order Type</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PURCHASE">Purchase Order</SelectItem>
                        <SelectItem value="SALES">Sales Order</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="customerSupplier"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>
                      {form.watch("type") === "PURCHASE" ? "Supplier" : "Customer"}
                    </FormLabel>
                    <FormControl>
                      <Input {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="PENDING">Pending</SelectItem>
                        <SelectItem value="APPROVED">Approved</SelectItem>
                        <SelectItem value="PROCESSING">Processing</SelectItem>
                        <SelectItem value="COMPLETED">Completed</SelectItem>
                        <SelectItem value="CANCELLED">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Order Items</h3>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append({ productId: "", quantity: 1, unitPrice: 0 })}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Add Item
                </Button>
              </div>

              {fields.map((field, index) => (
                <div key={field.id} className="grid grid-cols-4 gap-4">
                  <FormField
                    control={form.control}
                    name={`items.${index}.productId`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Product</FormLabel>
                        <Select
                          onValueChange={(value) => {
                            field.onChange(value);
                            const product = products.find((p) => p.id === value);
                            if (product) {
                              form.setValue(`items.${index}.unitPrice`, product.price);
                            }
                          }}
                          value={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select product" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {products.map((product) => (
                              <SelectItem key={product.id} value={product.id}>
                                {product.name}
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
                    name={`items.${index}.quantity`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Quantity</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="1"
                            step="0.1"
                            value={field.value}
                            onChange={(e) => handleNumericChange(e, field.onChange)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name={`items.${index}.unitPrice`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Unit Price</FormLabel>
                        <FormControl>
                          <Input
                            type="number"
                            min="0"
                            step="0.1"
                            value={field.value}
                            onChange={(e) => handleNumericChange(e, field.onChange, true)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex items-end">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => remove(index)}
                      className="mb-2"
                    >
                      <Trash2 className="h-5 w-5" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" disabled={isSubmitting} className="w-full">
              {isSubmitting ? "Saving..." : mode === 'edit' ? "Update Order" : "Save Order"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}