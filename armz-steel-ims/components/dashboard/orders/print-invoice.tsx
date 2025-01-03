// "use client";

// import { forwardRef } from "react";
// import { format } from "date-fns";
// import { Card } from "@/components/ui/card";

// interface PrintInvoiceProps {
//   order: {
//     orderNumber: string;
//     type: "PURCHASE" | "SALES";
//     status: string;
//     customer?: string;
//     supplier?: string;
//     totalAmount: number;
//     createdAt: string;
//     items: Array<{
//       id: string;
//       product: {
//         name: string;
//       };
//       quantity: number;
//       unitPrice: number;
//       totalPrice: number;
//     }>;
//     notes?: string;
//   };
// }

// export const PrintInvoice = forwardRef<HTMLDivElement, PrintInvoiceProps>(
//   ({ order }, ref) => {
//     if (!order) return null;

//     const formattedDate = order.createdAt
//       ? format(new Date(order.createdAt), "MMMM dd, yyyy")
//       : "";

//     return (
//       <div ref={ref} className="p-8 bg-white">
//         <div className="flex justify-between items-start mb-8">
//           <div>
//             <h1 className="text-2xl font-bold mb-2">Steel Mill IMS</h1>
//             <p className="text-gray-600">123 Steel Avenue</p>
//             <p className="text-gray-600">Industrial District</p>
//             <p className="text-gray-600">contact@steelmill.com</p>
//           </div>
//           <div className="text-right">
//             <h2 className="text-xl font-bold mb-2">
//               {order.type === "PURCHASE" ? "Purchase Order" : "Sales Invoice"}
//             </h2>
//             <p className="text-gray-600">Order #: {order.orderNumber}</p>
//             <p className="text-gray-600">Date: {formattedDate}</p>
//           </div>
//         </div>

//         <Card className="mb-8 p-6">
//           <h3 className="font-semibold mb-2">
//             {order.type === "PURCHASE" ? "Supplier" : "Customer"}
//           </h3>
//           <p>{order.type === "PURCHASE" ? order.supplier : order.customer}</p>
//         </Card>

//         <table className="w-full mb-8">
//           <thead>
//             <tr className="border-b">
//               <th className="text-left py-2">Item</th>
//               <th className="text-right py-2">Quantity</th>
//               <th className="text-right py-2">Unit Price</th>
//               <th className="text-right py-2">Total</th>
//             </tr>
//           </thead>
//           <tbody>
//             {order.items?.map((item) => (
//               <tr key={item.id} className="border-b">
//                 <td className="py-2">{item.product.name}</td>
//                 <td className="text-right py-2">{item.quantity}</td>
//                 <td className="text-right py-2">
//                   ${item.unitPrice.toLocaleString()}
//                 </td>
//                 <td className="text-right py-2">
//                   ${item.totalPrice.toLocaleString()}
//                 </td>
//               </tr>
//             ))}
//             <tr className="font-bold">
//               <td colSpan={3} className="text-right py-4">
//                 Total Amount:
//               </td>
//               <td className="text-right py-4">
//                 ${order.totalAmount.toLocaleString()}
//               </td>
//             </tr>
//           </tbody>
//         </table>

//         {order.notes && (
//           <div className="mb-8">
//             <h3 className="font-semibold mb-2">Notes</h3>
//             <p className="text-gray-600">{order.notes}</p>
//           </div>
//         )}

//         <div className="text-center text-gray-500 text-sm mt-8">
//           <p>Thank you for your business!</p>
//         </div>
//       </div>
//     );
//   }
// );

// PrintInvoice.displayName = "PrintInvoice";