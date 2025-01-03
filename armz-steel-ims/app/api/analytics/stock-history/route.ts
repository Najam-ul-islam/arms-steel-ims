import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get active products with their quantities
    const products = await prisma.product.findMany({
      where: {
        status: "active"
      },
      select: {
        quantity: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'asc',
      },
    });

    // Group by month and calculate totals - only active products
    const monthlyData = products.reduce((acc, product) => {
      const month = new Date(product.updatedAt).toLocaleString('default', { month: 'short' });
      if (!acc[month]) {
        acc[month] = 0;
      }
      acc[month] += product.quantity;
      return acc;
    }, {} as Record<string, number>);

    // Convert to array format for chart
    const data = Object.entries(monthlyData).map(([name, total]) => ({
      name,
      total,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[STOCK_HISTORY_GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch stock history" },
      { status: 500 }
    );
  }
}
