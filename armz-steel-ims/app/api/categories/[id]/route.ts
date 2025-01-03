import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const category = await prisma.category.findUnique({
      where: {
        id: params.id,
      },
      include: {
        products: true,
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    if (!category) {
      return NextResponse.json(
        { message: "Category not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_GET]", error);
    return NextResponse.json(
      { message: "Failed to fetch category" },
      { status: 500 }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { name, description } = body;

    if (name) {
      const existingCategory = await prisma.category.findFirst({
        where: {
          name,
          NOT: {
            id: params.id,
          },
        },
      });

      if (existingCategory) {
        return NextResponse.json(
          { message: "A category with this name already exists" },
          { status: 400 }
        );
      }
    }

    const category = await prisma.category.update({
      where: {
        id: params.id,
      },
      data: {
        name,
        description,
      },
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.error("[CATEGORY_PATCH]", error);
    return NextResponse.json(
      { message: "Failed to update category" },
      { status: 500 }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  if (!params.id) {
    return NextResponse.json(
      { message: "Category ID is required" },
      { status: 400 }
    );
  }

  try {
    // Use a transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // First check if the category exists
      const category = await tx.category.findUnique({
        where: { id: params.id },
        include: {
          products: {
            select: {
              id: true
            }
          }
        },
      });

      if (!category) {
        throw new Error("Category not found");
      }

      // Update all products to remove the category reference
      if (category.products.length > 0) {
        // Update each product individually to handle the schema correctly
        await Promise.all(
          category.products.map(product => 
            tx.product.update({
              where: { id: product.id },
              data: { categoryId: null }
            })
          )
        );
      }

      // Delete the category
      await tx.category.delete({
        where: { id: params.id },
      });

      return { 
        message: "Category deleted successfully",
        category 
      };
    });

    return NextResponse.json(result);
  } catch (error) {
    console.error("[CATEGORY_DELETE]", error);
    const message = error instanceof Error ? error.message : "Failed to delete category";
    return NextResponse.json(
      { message },
      { status: error instanceof Error && error.message === "Category not found" ? 404 : 500 }
    );
  }
}