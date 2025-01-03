import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get categories with their active products
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: {
            status: "active"
          },
          select: {
            quantity: true,
            minStock: true,
          },
        },
      },
    });

    // Calculate stock status for each category - only active products
    const data = categories.map(category => {
      const inStock = category.products.reduce((sum, product) => 
        sum + (product.quantity >= (product.minStock || 0) ? 1 : 0), 0
      );
      const lowStock = category.products.reduce((sum, product) => 
        sum + (product.quantity < (product.minStock || 0) ? 1 : 0), 0
      );

      return {
        name: category.name,
        inStock,
        lowStock,
      };
    });

    return NextResponse.json(data);
  } catch (error) {
    console.error("[STOCK_STATUS_GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch stock status" },
      { status: 500 }
    );
  }
}
