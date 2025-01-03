// "use client";

// import { useEffect, useState } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
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
// import { useToast } from "@/hooks/use-toast";

// // Define the schema
// const transactionSchema = z.object({
//   type: z.enum(["INBOUND", "OUTBOUND"], {
//     required_error: "Transaction type is required",
//   }),
//   productId: z.string().min(1, "Please select a product"),
//   quantity: z
//     .number({
//       invalid_type_error: "Quantity must be a number",
//     })
//     .min(1, "Quantity must be greater than 0"),
//   reference: z.string().optional(),
//   notes: z.string().optional(),
// });

// // Props type definition
// interface AddTransactionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function AddTransactionDialog({
//   open,
//   onOpenChange,
// }: AddTransactionDialogProps) {
//   const { toast } = useToast();
//   const [products, setProducts] = useState<Array<{ id: string; name: string }>>(
//     []
//   );
//   const [loading, setLoading] = useState(false);

//   const form = useForm<z.infer<typeof transactionSchema>>({
//     resolver: zodResolver(transactionSchema),
//     defaultValues: {
//       type: "INBOUND",
//       productId: "",
//       quantity: 1,
//       reference: "",
//       notes: "",
//     },
//   });

//   // Fetch products dynamically from the API
//   useEffect(() => {
//     const fetchProducts = async () => {
//       setLoading(true);
//       try {
//         const response = await fetch("/api/products"); // Adjust API endpoint as necessary
//         if (!response.ok) {
//           throw new Error("Failed to fetch products");
//         }
//         const data = await response.json();
//         setProducts(data); // Ensure API returns an array of { id, name }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "Failed to load products",
//           variant: "destructive",
//         });
//       } finally {
//         setLoading(false);
//       }
//     };

//     if (open) fetchProducts();
//   }, [open, toast]);

 
//   // const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
//   //   console.log(" submit product line 126 ----------------------");
//   //   try {
//   //     console.log(" submit product line 128 ----------------------");
//   //     const res = await fetch('/api/transaction', {
//   //       method: 'POST',
//   //       body: JSON.stringify(data),
//   //       headers: { 'Content-Type': 'application/json' },
        
//   //     });
//   //     console.log(" submit product line 135 ----------------------");
//   //     if (!res.ok) {
//   //       console.log(" submit product line 137 ----------------------");
//   //       const responseData = await res.json();
//   //       throw new Error(responseData.error || 'Failed to create transaction');
//   //       console.log(" submit product line 140 ----------------------");
//   //     }
//   //     console.log(" submit product line 142 ----------------------");
//   //     toast({ title: 'Success', description: 'Transaction created successfully.' });
//   //     onOpenChange(false);
//   //     form.reset();
//   //   } catch (err) {
//   //     console.log(" submit product line 146 ----------------------");
//   //     toast({ title: 'Error', description: String(err), variant: 'destructive' });
//   //   }
//   // };
  


//   const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
//     console.log("Data being submitted:", data); // Debug the data sent to the API
//     try {
//       const res = await fetch("/api/transaction", {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { "Content-Type": "application/json" },
//       });
  
//       console.log("Response status:", res.status);
//       if (!res.ok) {
//         const responseData = await res.json().catch(() => ({})); // Handle non-JSON responses
//         throw new Error(responseData.error || "Failed to create transaction");
//       }
  
//       toast({ title: "Success", description: "Transaction created successfully." });
//       onOpenChange(false);
//       form.reset();
//     } catch (err) {
//       console.error("Error submitting transaction:", err);
//       toast({ title: "Error", description: String(err), variant: "destructive" });
//     }
//   };
  
//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Transaction</DialogTitle>
//           <DialogDescription>
//             Create a new inventory transaction record.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             {/* Transaction Type */}
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Transaction Type</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="INBOUND">Inbound</SelectItem>
//                         <SelectItem value="OUTBOUND">Outbound</SelectItem>
//                         {/* <SelectItem value="OUTBOUND">Adjustment</SelectItem> */}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Product */}
//             <FormField
//               control={form.control}
//               name="productId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product</FormLabel>
//                   {loading ? (
//                     <p>Loading products...</p>
//                   ) : (
//                     <FormControl>
//                       <Select onValueChange={field.onChange} defaultValue={field.value}>
//                         <SelectTrigger>
//                           <SelectValue placeholder="Select product" />
//                         </SelectTrigger>
//                         <SelectContent>
//                           {products.map((product) => (
//                             <SelectItem key={product.id} value={product.id}>
//                               {product.name}
//                             </SelectItem>
//                           ))}
//                         </SelectContent>
//                       </Select>
//                     </FormControl>
//                   )}
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Quantity */}
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
//                       value={field.value || ""}
//                       onChange={(e) => field.onChange(Number(e.target.value))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Reference */}
//             <FormField
//               control={form.control}
//               name="reference"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Reference</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="e.g., PO-2024-001" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             {/* Notes */}
//             <FormField
//               control={form.control}
//               name="notes"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Notes</FormLabel>
//                   <FormControl>
//                     <Textarea {...field} placeholder="Add any additional notes..." />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <div className="flex justify-end space-x-2">
//               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Create Transaction</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }





// "use client";

// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogDescription,
// } from "@/components/ui/dialog";
// import {
//   Form,
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
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
// import { useToast } from "@/hooks/use-toast";

// // Define the schema
// const transactionSchema = z.object({
//   type: z.enum(["INBOUND", "OUTBOUND"], {
//     required_error: "Transaction type is required",
//   }),
//   productId: z.string().min(1, "Please select a product"),
//   quantity: z
//     .number({
//       invalid_type_error: "Quantity must be a number",
//     })
//     .min(1, "Quantity must be greater than 0"),
//   reference: z.string().optional(),
//   notes: z.string().optional(),
// });

// // Define the props type
// interface AddTransactionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
//   products: Array<{ id: string; name: string }>; // Add products type
// }

// export function AddTransactionDialog({
//   open,
//   onOpenChange,
//   products = [],
// }: AddTransactionDialogProps) {
//   const form = useForm({
//     resolver: zodResolver(transactionSchema),
//     defaultValues: { type: "INBOUND", quantity: 1 },
//   });
//   const { toast } = useToast();

//   const onSubmit = async (data: z.infer<typeof transactionSchema>) => {
//     try {
//       const res = await fetch("/api/transactions", {
//         method: "POST",
//         body: JSON.stringify(data),
//         headers: { "Content-Type": "application/json" },
//       });
//       if (!res.ok) throw new Error("Failed to create transaction");
//       toast({ title: "Success", description: "Transaction created successfully." });
//       onOpenChange(false);
//       form.reset();
//     } catch (err: any) {
//       toast({ title: "Error", description: err.message, variant: "destructive" });
//     }
//   };

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Transaction</DialogTitle>
//           <DialogDescription>
//             Create a new inventory transaction record.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Transaction Type</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select type" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         <SelectItem value="INBOUND">Inbound</SelectItem>
//                         <SelectItem value="OUTBOUND">Outbound</SelectItem>
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="productId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product</FormLabel>
//                   <FormControl>
//                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select product" />
//                       </SelectTrigger>
//                       <SelectContent>
//                         {products.map((product) => (
//                           <SelectItem key={product.id} value={product.id}>
//                             {product.name}
//                           </SelectItem>
//                         ))}
//                       </SelectContent>
//                     </Select>
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

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
//                       onChange={(e) => field.onChange(parseInt(e.target.value, 10))}
//                     />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="reference"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Reference</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="e.g., PO-2024-001" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

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

//             <div className="flex justify-end space-x-2">
//               <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
//                 Cancel
//               </Button>
//               <Button type="submit">Create Transaction</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }





// "use client";

// import { useState } from "react";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { useForm } from "react-hook-form";
// import * as z from "zod";
// import {
//   Dialog,
//   DialogContent,
//   DialogDescription,
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

// const transactionSchema = z.object({
//   type: z.enum(["INBOUND", "OUTBOUND", "ADJUSTMENT"]),
//   productId: z.string().min(1, "Please select a product"),
//   quantity: z.number().min(1, "Quantity must be greater than 0"),
//   reference: z.string().min(1, "Reference is required"),
//   notes: z.string().optional(),
// });

// const products = [
//   { id: "1", name: "Steel Rebar" },
//   { id: "2", name: "Steel Plate" },
//   { id: "3", name: "Steel Pipe" },
// ];

// interface AddTransactionDialogProps {
//   open: boolean;
//   onOpenChange: (open: boolean) => void;
// }

// export function AddTransactionDialog({
//   open,
//   onOpenChange,
// }: AddTransactionDialogProps) {
//   const form = useForm<z.infer<typeof transactionSchema>>({
//     resolver: zodResolver(transactionSchema),
//     defaultValues: {
//       type: "INBOUND",
//       quantity: 1,
//     },
//   });

//   async function onSubmit(data: z.infer<typeof transactionSchema>) {
//     try {
//       console.log(data);
//       // Here you would typically make an API call to save the transaction
//       onOpenChange(false);
//       form.reset();
//     } catch (error) {
//       console.error("Failed to create transaction:", error);
//     }
//   }

//   return (
//     <Dialog open={open} onOpenChange={onOpenChange}>
//       <DialogContent className="sm:max-w-[425px]">
//         <DialogHeader>
//           <DialogTitle>Add Transaction</DialogTitle>
//           <DialogDescription>
//             Create a new inventory transaction record.
//           </DialogDescription>
//         </DialogHeader>
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
//             <FormField
//               control={form.control}
//               name="type"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Transaction Type</FormLabel>
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
//                       <SelectItem value="ADJUSTMENT">Adjustment</SelectItem>
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

//             <FormField
//               control={form.control}
//               name="productId"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Product</FormLabel>
//                   <Select
//                     onValueChange={field.onChange}
//                     defaultValue={field.value}
//                   >
//                     <FormControl>
//                       <SelectTrigger>
//                         <SelectValue placeholder="Select product" />
//                       </SelectTrigger>
//                     </FormControl>
//                     <SelectContent>
//                       {products.map((product) => (
//                         <SelectItem key={product.id} value={product.id}>
//                           {product.name}
//                         </SelectItem>
//                       ))}
//                     </SelectContent>
//                   </Select>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

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

//             <FormField
//               control={form.control}
//               name="reference"
//               render={({ field }) => (
//                 <FormItem>
//                   <FormLabel>Reference</FormLabel>
//                   <FormControl>
//                     <Input {...field} placeholder="e.g., PO-2024-001" />
//                   </FormControl>
//                   <FormMessage />
//                 </FormItem>
//               )}
//             />

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

//             <div className="flex justify-end space-x-2">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => onOpenChange(false)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit">Create Transaction</Button>
//             </div>
//           </form>
//         </Form>
//       </DialogContent>
//     </Dialog>
//   );
// }