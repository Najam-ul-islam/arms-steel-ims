// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { TransactionFilters } from "./transaction-filters";
// import { TransactionPagination } from "./transaction-pagination";
// import { DashboardSkeleton } from "../dashboard-skeleton";
// import { useToast } from "@/hooks/use-toast";

// // Define types for state variables
// type SortBy = "date" | "amount";
// type SortOrder = "asc" | "desc";

// export function TransactionList() {
//   const [transactions, setTransactions] = useState<any[]>([]);
//   const [pagination, setPagination] = useState<{ pages: number; total: number }>({
//     pages: 1,
//     total: 0,
//   });
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);

//   const [sortBy, setSortBy] = useState<SortBy>("date");
//   const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
//   const [type, setType] = useState<string>("");
//   const [currentPage, setCurrentPage] = useState<number>(1);
//   const { toast } = useToast();

//   const fetchTransactions = async () => {
//     setLoading(true);
//     setError(null);
//     console.log("Fetching transactions line 41 ..........................");
//     try {
//       console.log("Fetching transactions line 43 ..........................");
//       const res = await fetch(
        
//         `/api/transaction?page=${currentPage}&sortBy=${sortBy}&sortOrder=${sortOrder}&type=${type}`
//       );
//       console.log("Fetching transactions line 48 ..........................");
//       const data = await res.json();
//       setTransactions(data.transactions);
//       setPagination(data.pagination);
//     } catch (err) {
//       setError("Failed to fetch transactions.");
//       toast({
//         title: "Error",
//         description: "Failed to fetch transactions.",
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchTransactions();
//   }, [currentPage, sortBy, sortOrder, type]);

//   if (loading) return <DashboardSkeleton />;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="space-y-4">
//       <TransactionFilters
//         sortBy={sortBy}
//         sortOrder={sortOrder}
//         type={type}
//         onSortByChange={setSortBy}
//         onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//         onTypeChange={setType}
//       />

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Notes</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {transactions.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   No transactions found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               transactions.map((transaction) => (
//                 <TableRow key={transaction.id}>
//                   <TableCell>
//                     {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         transaction.type === "INBOUND"
//                           ? "default"
//                           : transaction.type === "OUTBOUND"
//                           ? "secondary"
//                           : "outline"
//                       }
//                     >
//                       {transaction.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{transaction.product.name}</TableCell>
//                   <TableCell>
//                     {transaction.type === "OUTBOUND" ? "-" : ""}{transaction.quantity}{" "}
//                     {transaction.product.unit}
//                   </TableCell>
//                   <TableCell className="max-w-[200px] truncate">
//                     {transaction.notes}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {pagination && pagination.pages > 1 && (
//         <div className="flex justify-center mt-4">
//           <TransactionPagination
//             currentPage={currentPage}
//             totalPages={pagination.pages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// }



























// "use client";

// import { useState, useEffect } from "react";
// import { format } from "date-fns";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { TransactionFilters } from "./transaction-filters";
// import { TransactionPagination } from "./transaction-pagination";
// import { useTransactions } from "@/hooks/use-transactions";
// import { DashboardSkeleton } from "../dashboard-skeleton";

// export function TransactionList() {
//   const [sortBy, setSortBy] = useState<"date" | "amount">("date");
//   const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
//   const [type, setType] = useState("");
//   const [currentPage, setCurrentPage] = useState(1);
//   const { transactions, pagination, loading, error, fetchTransactions } = useTransactions();

//   useEffect(() => {
//     fetchTransactions({
//       page: currentPage,
//       sortBy,
//       sortOrder,
//       type: type as any,
//     });
//   }, [currentPage, sortBy, sortOrder, type]);

//   if (loading) return <DashboardSkeleton />;
//   if (error) return <div>Error: {error}</div>;

//   return (
//     <div className="space-y-4">
//       <TransactionFilters
//         sortBy={sortBy}
//         sortOrder={sortOrder}
//         type={type}
//         onSortByChange={setSortBy}
//         onSortOrderChange={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}
//         onTypeChange={setType}
//       />

//       <div className="rounded-md border">
//         <Table>
//           <TableHeader>
//             <TableRow>
//               <TableHead>Date</TableHead>
//               <TableHead>Type</TableHead>
//               <TableHead>Product</TableHead>
//               <TableHead>Quantity</TableHead>
//               <TableHead>Notes</TableHead>
//             </TableRow>
//           </TableHeader>
//           <TableBody>
//             {transactions.length === 0 ? (
//               <TableRow>
//                 <TableCell colSpan={5} className="text-center py-8">
//                   No transactions found
//                 </TableCell>
//               </TableRow>
//             ) : (
//               transactions.map((transaction) => (
//                 <TableRow key={transaction.id}>
//                   <TableCell>
//                     {format(new Date(transaction.createdAt), "MMM dd, yyyy HH:mm")}
//                   </TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         transaction.type === "INBOUND"
//                           ? "default"
//                           : transaction.type === "OUTBOUND"
//                           ? "secondary"
//                           : "outline"
//                       }
//                     >
//                       {transaction.type}
//                     </Badge>
//                   </TableCell>
//                   <TableCell>{transaction.product.name}</TableCell>
//                   <TableCell>
//                     {transaction.type === "OUTBOUND" ? "-" : ""}
//                     {transaction.quantity} {transaction.product.unit}
//                   </TableCell>
//                   <TableCell className="max-w-[200px] truncate">
//                     {transaction.notes}
//                   </TableCell>
//                 </TableRow>
//               ))
//             )}
//           </TableBody>
//         </Table>
//       </div>

//       {pagination && pagination.pages > 1 && (
//         <div className="flex justify-center mt-4">
//           <TransactionPagination
//             currentPage={currentPage}
//             totalPages={pagination.pages}
//             onPageChange={setCurrentPage}
//           />
//         </div>
//       )}
//     </div>
//   );
// }