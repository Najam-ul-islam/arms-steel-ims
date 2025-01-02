// "use client";

// import { useState, useEffect } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormControl,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormMessage,
// } from "@/components/ui/form";
// import {
//   Select,
//   SelectContent,
//   SelectItem,
//   SelectTrigger,
//   SelectValue,
// } from "@/components/ui/select";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";
// import { Button } from "@/components/ui/button";
// import { Transaction } from "@prisma/client";

// const formSchema = z.object({
//   type: z.enum(["INBOUND", "OUTBOUND" , "ADJUSTMENT"]),
//   productId: z.string().min(1, "Product is required"),    
//   quantity: z.number().min(1, "Quantity must be positive"),
//   notes: z.string().optional(),
// });
// interface TransactionTableProps {

//   transactions: Transaction[];

// }

// export function TransactionModal({
//   open,
//   onClose,
// }: {
//   open: boolean;
//   onClose: () => void;
// }) {
//   const [products, setProducts] = useState<
//     { id: string; name: string }[]
//   >([]);
//   const [loading, setLoading] = useState(true);

//   const form = useForm({
//     resolver: zodResolver(formSchema),
//     defaultValues: {
//       type: "INBOUND",
//       productId: "",
//       quantity: 1,
//       notes: "",
//     },
//   });

//   // Fetch products from the database
//   useEffect(() => {
//     const fetchProducts = async () => {
//       try {
//         const response = await fetch("/api/products"); // Adjust API endpoint if needed
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data = await response.json();
//         setProducts(data); // Assuming the API returns an array of { id, name }
//       } catch (error) {
//         console.error("Error fetching products:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open) {
//       fetchProducts();
//     }
//   }, [open]);

//   const onSubmit = async (data: any) => {
//     console.log(data);
//     onClose();
//   };

//   return (
//     <Dialog open={open} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-[425px]">
//         {/* <DialogHeader>
//           <DialogTitle>New Transaction</DialogTitle>
//         </DialogHeader> */}
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Type Field */}
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Type</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       <SelectItem value="INBOUND">Inbound</SelectItem>
//                       <SelectItem value="OUTBOUND">Outbound</SelectItem>
//                       <SelectItem value="OUTBOUND">Adjustment</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Product Field */}
//             <FormField
//               control={form.control}
//               name="productId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product</FormLabel>
//                   {loading ? (
//                     <p>Loading products...</p>
//                   ) : (
//                     <Select
//                       onValueChange={field.onChange}
//                       defaultValue={field.value}
//                     >
//                       <FormControl>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select product" />
//                         </SelectTrigger>
//                       </FormControl>
//                       <SelectContent>
//                         {products.map((product) => (
//                           <SelectItem key={product.id} value={product.id}>
//                             {product.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Quantity Field */}
//             <FormField
//               control={form.control}
//               name="quantity"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Quantity</FormLabel>
//                   <FormControl>
//                     <Input
//                       type="number"
//                       {...field}
//                       onChange={(e) =>
//                         field.onChange(parseInt(e.target.value, 10))
//                       }
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Notes Field */}
//             <FormField
//               control={form.control}
//               name="notes"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Notes</FormLabel>
//                   <FormControl>
//                     <Textarea {...field} />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Buttons */}
//             <div className="flex justify-end gap-2">
//               <Button type="button" variant="outline" onClick={onClose}>
//                 Cancel
//               </Button>
//               <Button type="submit">Save</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }
