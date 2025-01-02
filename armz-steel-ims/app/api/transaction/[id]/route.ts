// import { NextApiRequest, NextApiResponse } from 'next';

// let transactions = [
//   { id: '1', transactionType: 'Inbound', product: 'Steel', quantity: 100, reference: 'Order #123', notes: 'Urgent' },
//   { id: '2', transactionType: 'Outbound', product: 'Iron', quantity: 50, reference: 'Invoice #456', notes: 'Regular' },
// ];

// // Update or Delete Transaction
// export default function handler(req: NextApiRequest, res: NextApiResponse) {
//   const { id } = req.query;

//   if (req.method === 'PUT') {
//     const { transactionType, product, quantity, reference, notes } = req.body;
//     transactions = transactions.map((t) =>
//       t.id === id ? { ...t, transactionType, product, quantity, reference, notes } : t
//     );
//     res.status(200).json({ message: 'Transaction updated' });
//   } else if (req.method === 'DELETE') {
//     transactions = transactions.filter((t) => t.id !== id);
//     res.status(200).json({ message: 'Transaction deleted' });
//   }
// }























// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Fetch a single transaction by ID
//     const transaction = await prisma.transaction.findUnique({
//       where: {
//         id: params.id,
//       },
//       include: {
//         product: true, // Include product details
//       },
//     });

//     if (!transaction) {
//       return new NextResponse("Transaction not found", { status: 404 });
//     }

//     return NextResponse.json(transaction);
//   } catch (error) {
//     console.error("[TRANSACTION_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function PATCH(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const body = await req.json();
//     const { type, productId, quantity, notes } = body;

//     // Fetch the current transaction
//     const currentTransaction = await prisma.transaction.findUnique({
//       where: { id: params.id },
//     });

//     if (!currentTransaction) {
//       return new NextResponse("Transaction not found", { status: 404 });
//     }

//     // Fetch the product
//     const product = await prisma.product.findUnique({
//       where: { id: productId },
//     });

//     if (!product) {
//       return new NextResponse("Product not found", { status: 404 });
//     }

//     // Calculate new stock
//     let newStock = product.quantity ?? 0;

//     // Revert the previous transaction's stock adjustment
//     switch (currentTransaction.type) {
//       case "INBOUND":
//         newStock -= currentTransaction.quantity;
//         break;
//       case "OUTBOUND":
//         newStock += currentTransaction.quantity;
//         break;
//       case "ADJUSTMENT":
//         newStock = currentTransaction.quantity; // Reset to previous value
//         break;
//     }

//     // Apply the new transaction's stock adjustment
//     switch (type) {
//       case "INBOUND":
//         newStock += quantity;
//         break;
//       case "OUTBOUND":
//         if (newStock < quantity) {
//           return new NextResponse("Insufficient stock", { status: 400 });
//         }
//         newStock -= quantity;
//         break;
//       case "ADJUSTMENT":
//         newStock = quantity;
//         break;
//     }

//     // Update the transaction and product in a transaction
//     const updatedTransaction = await prisma.$transaction([
//       prisma.transaction.update({
//         where: { id: params.id },
//         data: { type, productId, quantity, notes },
//       }),
//       prisma.product.update({
//         where: { id: productId },
//         data: { quantity: newStock },
//       }),
//     ]);

//     return NextResponse.json(updatedTransaction[0]); // Return the updated transaction
//   } catch (error) {
//     console.error("[TRANSACTION_PATCH]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }

// export async function DELETE(
//   req: Request,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     // Fetch the transaction to adjust the stock before deletion
//     const transaction = await prisma.transaction.findUnique({
//       where: { id: params.id },
//     });

//     if (!transaction) {
//       return new NextResponse("Transaction not found", { status: 404 });
//     }

//     // Fetch the product
//     const product = await prisma.product.findUnique({
//       where: { id: transaction.productId },
//     });

//     if (!product) {
//       return new NextResponse("Product not found", { status: 404 });
//     }

//     // Adjust stock based on transaction type
//     let newStock = product.quantity ?? 0;
//     switch (transaction.type) {
//       case "INBOUND":
//         newStock -= transaction.quantity;
//         break;
//       case "OUTBOUND":
//         newStock += transaction.quantity;
//         break;
//       case "ADJUSTMENT":
//         newStock = product.quantity; // Restore original stock
//         break;
//     }

//     // Delete the transaction and update the product stock
//     await prisma.$transaction([
//       prisma.transaction.delete({
//         where: { id: params.id },
//       }),
//       prisma.product.update({
//         where: { id: transaction.productId },
//         data: { quantity: newStock },
//       }),
//     ]);

//     return new NextResponse(null, { status: 204 });
//   } catch (error) {
//     console.error("[TRANSACTION_DELETE]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }
