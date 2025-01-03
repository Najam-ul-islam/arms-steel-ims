// API Code
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma instance if needed.

type OrderType = "SALES" | "PURCHASE"; // Ensure the type matches your database

export async function GET() {
  try {
    // Fetch orders with necessary fields
    const orders = await prisma.order.findMany({
      select: {
        createdAt: true,
        type: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    // Ensure proper typing
    const typedOrders = orders as unknown as Array<{ type: OrderType; createdAt: string; totalAmount: number }>;

    // Aggregate data by month
    const aggregatedData = typedOrders.reduce(
      (acc: Record<string, { date: string; sales: number; purchase: number }>, order) => {
        const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
        if (!acc[month]) {
          acc[month] = { date: month, sales: 0, purchase: 0 };
        }
        if (order.type === "SALES") {
          acc[month].sales += order.totalAmount || 0;
        } else if (order.type === "PURCHASE") {
          acc[month].purchase += order.totalAmount || 0;
        }
        return acc;
      },
      {}
    );

    // Convert aggregated data to an array
    const chartData = Object.values(aggregatedData);

    return NextResponse.json({ chartData });
  } catch (error) {
    console.error("[ORDERS_GET] Failed to fetch order data:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}












// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma instance if needed.

// type OrderType = "SALES" | "PURCHASE"; // Ensure the type matches your database

// export async function GET() {
//   try {
//     // Fetch orders with necessary fields
//     const orders = await prisma.order.findMany({
//       select: {
//         createdAt: true,
//         type: true,
//         totalAmount: true,
//       },
//       orderBy: {
//         createdAt: "desc",
//       },
//     });

//     // Ensure proper typing
//     const typedOrders = orders as unknown as Array<{ type: OrderType; createdAt: string; totalAmount: number }>;

//     // Aggregate data by month
//     const aggregatedData = typedOrders.reduce(
//       (acc: Record<string, { date: string; sales: number; purchase: number }>, order) => {
//         const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
//         if (!acc[month]) {
//           acc[month] = { date: month, sales: 0, purchase: 0 };
//         }
//         if (order.type === "SALES") {
//           acc[month].sales += order.totalAmount || 0;
//         } else if (order.type === "PURCHASE") {
//           acc[month].purchase += order.totalAmount || 0;
//         }
//         return acc;
//       },
//       {}
//     );

//     // Convert aggregated data to an array
//     const chartData = Object.values(aggregatedData);

//     return NextResponse.json({ chartData });
//   } catch (error) {
//     console.error("[ORDERS_GET] Failed to fetch order data:", error);
//     return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
//   }
// }





// import { NextResponse } from "next/server";
// import { prisma } from "@/lib/prisma"; // Adjust the path to your Prisma instance if needed.

// type OrderType = "SALES" | "PURCHASE"; // Ensure OrderType includes the string literals

// export async function GET() {
//   try {
//     const orders = await prisma.order.findMany({
//         include: {
//             items: {
//                 include: {
//                     product: true,
//                 },
//             },
//         },
//         orderBy: {
//             createdAt: "desc",
//         },
//     }) as unknown as Array<{ type: OrderType; createdAt: string; totalAmount: number }>;

//     // Aggregate data by month
//     const aggregatedData = orders.reduce((acc: Record<string, { date: string; sales: number; purchase: number }>, order) => {
//       const month = new Date(order.createdAt).toLocaleString("default", { month: "short" });
//       if (!acc[month]) {
//         acc[month] = { date: month, sales: 0, purchase: 0 };
//       }
//       if (order.type === "SALES") {
//         acc[month].sales += order.totalAmount;
//       } else if (order.type === "PURCHASE") {
//         acc[month].purchase += order.totalAmount;
//       }
//       return acc;
//     }, {});

//     // Convert aggregated data into an array
//     const chartData = Object.values(aggregatedData);

//     return NextResponse.json({ orders, chartData });
//   } catch (error) {
//     console.error("Failed to fetch order data:", error);
//     return NextResponse.json({ error: "Failed to fetch order data" }, { status: 500 });
//   }
// }