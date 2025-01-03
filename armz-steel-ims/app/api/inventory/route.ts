// pages/api/inventory.ts
import { NextApiRequest, NextApiResponse } from "next";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";

const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method !== "GET") {
//     console.error("Method Not Allowed");
//     return res.status(405).json({ error: "Method Not Allowed" });
//   }

//   try {
//     // Fetch categories and products from the database
//     const categories = await prisma.category.findMany();
//     const products = await prisma.product.findMany();

//     // Calculate inventory data
//     const inventoryData = categories.map((category) => {
//       const relatedProducts = products.filter(
//         (product) => product.categoryId === category.id
//       );

//       const totalItems = relatedProducts.reduce(
//         (sum, product) => sum + product.quantity,
//         0
//       );

//       const totalValue = relatedProducts.reduce(
//         (sum, product) => sum + Number(product.unit) * product.quantity,
//         0
//       );

//       return {
//         category: category.name,
//         totalItems,
//         value: `$${totalValue.toLocaleString()}`,
//         turnover: (totalItems / 365).toFixed(1), // Example turnover calculation
//       };
//     });

//     res.status(200).json(inventoryData);
//   } catch (error) {
//     console.error("Error fetching inventory data:", error);
//     res.status(500).json({ error: "Internal Server Error" });
//   } finally {
//     await prisma.$disconnect();
//   }
// }

// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch categories and products from the database
    const categories = await prisma.category.findMany();
    const products = await prisma.product.findMany();

    // Calculate inventory data
    const inventoryData = categories.map((category) => {
      const relatedProducts = products.filter(
        (product) => product.categoryId === category.id
      );

      const totalItems = relatedProducts.reduce(
        (sum, product) => sum + product.quantity, // Use the correct field for stock/quantity
        0
      );

      const totalValue = relatedProducts.reduce(
        (sum, product) => sum + Number(product.unit) * product.quantity,// Ensure correct field for price and stock
        0
      );

      return {
        category: category.name,
        totalItems,
        value: `${totalValue.toLocaleString()}`,
        turnover: (totalItems / 365).toFixed(1), // Example turnover calculation
      };
    });

    return NextResponse.json(inventoryData);
  } catch (error) {
    console.error("Error fetching inventory data:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}
