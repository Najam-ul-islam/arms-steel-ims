import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    // Get categories with their active product counts
    const categories = await prisma.category.findMany({
      include: {
        products: {
          where: {
            status: "active"
          }
        },
        _count: {
          select: {
            products: {
              where: {
                status: "active"
              }
            }
          }
        }
      }
    });

    // Format data for pie chart - only counting active products
    const data = categories.map(category => ({
      name: category.name,
      value: category._count.products,
    }));

    return NextResponse.json(data);
  } catch (error) {
    console.error("[CATEGORY_DISTRIBUTION_GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch category distribution" },
      { status: 500 }
    );
  }
}
