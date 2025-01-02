import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(): Promise<NextResponse> {
  try {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    // Total active products
    const totalActiveProducts = await prisma.product.count({
      where: { status: "active" },
    });

    // Low stock items
    const lowStockItems = await prisma.product.count({
      where: {
        AND: [{ quantity: { lte: 10 } }, { status: "active" }],
      },
    });

    // Sales amount today
    const salesAggregate = await prisma.order.aggregate({
      where: {
        type: "SALES",
        createdAt: { gte: today },
      },
      _sum: { totalAmount: true },
    });

    // Purchased amount today
    const purchaseAggregate = await prisma.order.aggregate({
      where: {
        type: "PURCHASE",
        createdAt: { gte: today },
      },
      _sum: { totalAmount: true },
    });

    // Compile results
    const stats = {
      totalActiveProducts,
      lowStockItems,
      salesAmountToday: salesAggregate._sum.totalAmount || 0,
      purchasedAmountToday: purchaseAggregate._sum.totalAmount || 0,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error("[DASHBOARD_GET_ERROR]", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}























// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     // Get total active products
//     const totalProducts = await prisma.product.count({
//       where: {
//         status: 'active', 
//       },
//     });
//     // Get low stock items from active products
//     const lowStock = await prisma.product.count({
//       where: {
//         AND: [
//           { quantity: { lte: prisma.product.fields.minStock || 10 } }, // Check for low stock
//           { status: 'active' }, // Ensure the product is active
//         ],
//       },
//     });

//     // Get today's sales and purchase amounts
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const [salesAmountToday, purchasedAmountToday] = await Promise.all([
//       prisma.order.aggregate({
//         _sum: { totalAmount: true },
//         where: {
//           type: "SALE",
//           createdAt: { gte: today },
//         },
//       }),
//       prisma.order.aggregate({
//         _sum: { totalAmount: true },
//         where: {
//           type: "PURCHASE",
//           createdAt: { gte: today },
//         },
//       }),
//     ]);

//     return NextResponse.json({
//       stats: {
//         totalActiveProducts,
//         lowStockItems,
//         salesAmountToday: salesAmountToday._sum.totalAmount || 0,
//         purchasedAmountToday: purchasedAmountToday._sum.totalAmount || 0,
//       },
//     });
//   } catch (error) {
//     console.error("[DASHBOARD_GET_ERROR]", error);
//     return new NextResponse("Internal server error", { status: 500 });
//   }
// }























// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     // Get total products
//     const totalProducts = await prisma.product.count();

//     // Get low stock items
//     const lowStock = await prisma.product.count({
//       where: {
//         OR: [
//           {
//             AND: [
//               { minStock: { not: null } },
//               {
//                 quantity: {
//                   lte: { ref: 'minStock' }
//                 }
//               }
//             ]
//           },
//           {
//             AND: [
//               { minStock: null },
//               { quantity: { lte: 10 } }
//             ]
//           }
//         ]
//       }
//     });

//     // Get today's transactions
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     const inboundToday = await prisma.transaction.count({
//       where: {
//         type: "INBOUND",
//         createdAt: {
//           gte: today,
//         },
//       },
//     });

//     const outboundToday = await prisma.transaction.count({
//       where: {
//         type: "OUTBOUND",
//         createdAt: {
//           gte: today,
//         },
//       },
//     });

//     // Get chart data for the last 7 days
//     const dates = Array.from({ length: 7 }, (_, i) => {
//       const date = new Date();
//       date.setDate(date.getDate() - i);
//       date.setHours(0, 0, 0, 0);
//       return date;
//     }).reverse();

//     const chartData = await Promise.all(
//       dates.map(async (date) => {
//         const nextDate = new Date(date);
//         nextDate.setDate(date.getDate() + 1);

//         const [inbound, outbound] = await Promise.all([
//           prisma.transaction.count({
//             where: {
//               type: "INBOUND",
//               createdAt: {
//                 gte: date,
//                 lt: nextDate,
//               },
//             },
//           }),
//           prisma.transaction.count({
//             where: {
//               type: "OUTBOUND",
//               createdAt: {
//                 gte: date,
//                 lt: nextDate,
//               },
//             },
//           }),
//         ]);

//         return {
//           date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
//           inbound,
//           outbound,
//         };
//       })
//     );

//     return NextResponse.json({
//       stats: {
//         totalProducts,
//         lowStock,
//         inboundToday,
//         outboundToday,
//       },
//       chartData,
//     });
//   } catch (error) {
//     console.error("[DASHBOARD_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }