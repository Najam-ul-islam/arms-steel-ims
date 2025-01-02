import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// export async function GET() {
//   try {
//     const products = await prisma.product.findMany({
//       include: {
//         category: true,
//       },
//     });
//     return NextResponse.json(products);
//   } catch (error) {
//     console.error("[PRODUCTS_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }


export async function GET() {
  try {
    const products = await prisma.product.findMany({
      select: {
        id: true,
        name: true,
        sku: true,
        status: true,
        categoryId: true,
        unit: true,
        quantity: true,
        minStock: true,
        description: true,
        category: {
          select: {
            id: true,
            name: true,
          },
        },
      },
    });

    return NextResponse.json({ products });
  } catch (error) {
    console.error("[PRODUCTS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

// export async function GET() {
//   try {
//     // Get total products
//     const totalProducts = await prisma.product.count({
//       where: { status: "active" },
//     });

//     // Get low stock items
//     const lowStock = await prisma.product.count({
//       where: {
//         status: "active",
//         quantity: {
//           lte: prisma.product.fields.minStock,
//         },
//       },
//     });

//     // Get today's date
//     const today = new Date();
//     today.setHours(0, 0, 0, 0);

//     // Get today's sales and purchased order amounts
//     const orders = await prisma.order.findMany({
//       where: {
//         createdAt: {
//           gte: today,
//         },
//       },
//       select: {
//         type: true,
//         totalAmount: true,
//       },
//     });

//     const salesAmountToday = orders
//       .filter(order => order.type === "SALES")
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     const purchasedAmountToday = orders
//       .filter(order => order.type === "PURCHASE")
//       .reduce((sum, order) => sum + order.totalAmount, 0);

//     return NextResponse.json({
//       totalProducts,
//       lowStock,
//       salesAmountToday,
//       purchasedAmountToday,
//     });
//   } catch (error) {
//     console.error("[DASHBOARD_GET]", error);
//     return new NextResponse("Internal error", { status: 500 });
//   }
// }












export async function POST(req: Request) {
  try {
    
    const body = await req.json();
    const { name, sku, categoryId, description, quantity, unit, minStock } = body;
    const product = await prisma.product.create({
      data: {
        name,
        sku,
        categoryId,
        description,
        quantity,
        unit,
        minStock,
      },
      include: {
        category: true,
      },
    });


    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCTS_POST]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}