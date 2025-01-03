// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { useEffect, useState } from "react";

// interface StockItem {
//   product: string;
//   quantity: number;
//   minStock: number;
//   maxStock: number;
//   status: string;
// }

// export function StockReport() {
//   const [stockLevels, setStockLevels] = useState<StockItem[]>([]);

//   useEffect(() => {
//     // Fetch stock data from the API
//     const fetchStockData = async () => {
//       try {
//         const response = await fetch("/api/products");
//         const data = await response.json();
//         setStockLevels(data);
//       } catch (error) {
//         console.error("Error fetching stock data:", error);
//       }
//     };

//     fetchStockData();
//   }, []);

//   // Count items by status
//   const optimalCount = stockLevels.filter((item) => item.status === "Optimal")
//     .length;
//   const lowCount = stockLevels.filter((item) => item.status === "Low").length;
//   const highCount = stockLevels.filter((item) => item.status === "High").length;

//   return (
//     <div className="grid gap-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Stock Levels</CardTitle>
//           <CardDescription>Current inventory status by product</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Quantity</TableHead>
//                 <TableHead>Min Stock</TableHead>
//                 <TableHead>Max Stock</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {stockLevels.map((item) => (
//                 <TableRow key={item.product}>
//                   <TableCell className="font-medium">{item.product}</TableCell>
//                   <TableCell>{item.quantity}</TableCell>
//                   <TableCell>{item.minStock}</TableCell>
//                   <TableCell>{item.maxStock}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         item.status === "Low"
//                           ? "destructive"
//                           : item.status === "High"
//                           ? "secondary"
//                           : "default"
//                       }
//                     >
//                       {item.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Optimal Stock Items
//             </CardTitle>
//             <span className="text-2xl font-bold text-green-500">
//               {optimalCount}
//             </span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
//             <span className="text-2xl font-bold text-red-500">
//               {lowCount}
//             </span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">High Stock Items</CardTitle>
//             <span className="text-2xl font-bold text-blue-500">
//               {highCount}
//             </span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Stock Utilization
//             </CardTitle>
//             <span className="text-2xl font-bold">
//               {(
//                 (optimalCount / stockLevels.length) *
//                 100
//               ).toFixed(1)}
//               %
//             </span>
//           </CardHeader>
//         </Card>
//       </div>
//     </div>
//   );
// }































// "use client";

// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";

// const stockLevels = [
//   {
//     product: "Steel Rebar",
//     quantity: 500,
//     minStock: 100,
//     maxStock: 1000,
//     status: "Optimal",
//   },
//   {
//     product: "Steel Plate",
//     quantity: 50,
//     minStock: 100,
//     maxStock: 500,
//     status: "Low",
//   },
//   {
//     product: "Steel Pipe",
//     quantity: 450,
//     minStock: 200,
//     maxStock: 600,
//     status: "Optimal",
//   },
//   {
//     product: "Steel Beam",
//     quantity: 580,
//     minStock: 300,
//     maxStock: 600,
//     status: "High",
//   },
// ];

// export function StockReport() {
//   return (
//     <div className="grid gap-4">
//       <Card>
//         <CardHeader>
//           <CardTitle>Stock Levels</CardTitle>
//           <CardDescription>Current inventory status by product</CardDescription>
//         </CardHeader>
//         <CardContent>
//           <Table>
//             <TableHeader>
//               <TableRow>
//                 <TableHead>Product</TableHead>
//                 <TableHead>Quantity</TableHead>
//                 <TableHead>Min Stock</TableHead>
//                 <TableHead>Max Stock</TableHead>
//                 <TableHead>Status</TableHead>
//               </TableRow>
//             </TableHeader>
//             <TableBody>
//               {stockLevels.map((item) => (
//                 <TableRow key={item.product}>
//                   <TableCell className="font-medium">{item.product}</TableCell>
//                   <TableCell>{item.quantity}</TableCell>
//                   <TableCell>{item.minStock}</TableCell>
//                   <TableCell>{item.maxStock}</TableCell>
//                   <TableCell>
//                     <Badge
//                       variant={
//                         item.status === "Low"
//                           ? "destructive"
//                           : item.status === "High"
//                           ? "secondary"
//                           : "default"
//                       }
//                     >
//                       {item.status}
//                     </Badge>
//                   </TableCell>
//                 </TableRow>
//               ))}
//             </TableBody>
//           </Table>
//         </CardContent>
//       </Card>

//       <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Optimal Stock Items
//             </CardTitle>
//             <span className="text-2xl font-bold text-green-500">24</span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">Low Stock Items</CardTitle>
//             <span className="text-2xl font-bold text-red-500">3</span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">High Stock Items</CardTitle>
//             <span className="text-2xl font-bold text-blue-500">5</span>
//           </CardHeader>
//         </Card>
//         <Card>
//           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
//             <CardTitle className="text-sm font-medium">
//               Stock Utilization
//             </CardTitle>
//             <span className="text-2xl font-bold">78%</span>
//           </CardHeader>
//         </Card>
//       </div>
//     </div>
//   );
// }