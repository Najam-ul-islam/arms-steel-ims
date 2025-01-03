import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get total active products
    const totalProducts = await prisma.product.count({
      where: {
        status: "active"
      }
    });

    // Get total categories
    const totalCategories = await prisma.category.count();

    // Get all active products with their details
    const products = await prisma.product.findMany({
      where: {
        status: "active"
      },
      select: {
        quantity: true,
        minStock: true,
        maxStock: true,
      },
    });

    // Analyze stock levels
    let lowStockItems = 0;
    let optimalStockItems = 0;
    let overStockItems = 0;

    products.forEach(product => {
      if (product.minStock !== null && product.quantity < product.minStock) {
        lowStockItems++;
      } else if (product.maxStock !== null && product.quantity > product.maxStock) {
        overStockItems++;
      } else {
        optimalStockItems++;
      }
    });

    // Calculate stock health percentage
    const totalStockItems = products.length;
    const stockHealth = totalStockItems > 0 
      ? Math.round((optimalStockItems / totalStockItems) * 100)
      : 0;

    return NextResponse.json({
      totalProducts,
      totalCategories,
      stockAnalysis: {
        lowStockItems,
        optimalStockItems,
        overStockItems,
        stockHealth,
      },
      stockDistribution: {
        lowStock: Math.round((lowStockItems / totalStockItems) * 100) || 0,
        optimal: Math.round((optimalStockItems / totalStockItems) * 100) || 0,
        overStock: Math.round((overStockItems / totalStockItems) * 100) || 0,
      },
    });
  } catch (error) {
    console.error("[ANALYTICS_GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch analytics" },
      { status: 500 }
    );
  }
}
