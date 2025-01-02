import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { z } from "zod";

const categorySchema = z.object({
  name: z.string().min(1, "Category name is required").max(100),
  description: z.string().optional(),
});

export async function GET() {
  try {
    const categories = await prisma.category.findMany({
      include: {
        _count: {
          select: {
            products: true,
          },
        },
      },
      orderBy: {
        name: 'asc',
      },
    });

    if (!categories.length) {
      const defaultCategories = [
        {
          name: 'Steel Bars',
          description: 'Various types of steel bars and rods',
        },
        {
          name: 'Steel Plates',
          description: 'Flat steel plates and sheets',
        },
        {
          name: 'Steel Pipes',
          description: 'Hollow steel pipes and tubes',
        },
      ];

      const createdCategories = await Promise.all(
        defaultCategories.map(category =>
          prisma.category.create({
            data: category,
            include: {
              _count: {
                select: {
                  products: true,
                },
              },
            },
          })
        )
      );

      return NextResponse.json(createdCategories);
    }

    return NextResponse.json(categories);
  } catch (error) {
    console.error("[CATEGORIES_GET]", error);
    return NextResponse.json(
      { error: "Failed to fetch categories" },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    
    const validatedData = categorySchema.parse(body);

    const existingCategory = await prisma.category.findFirst({
      where: { 
        name: {
          equals: validatedData.name,
          mode: 'insensitive',
        }
      },
    });

    if (existingCategory) {
      return NextResponse.json(
        { error: "A category with this name already exists" },
        { status: 400 }
      );
    }

    const category = await prisma.category.create({
      data: validatedData,
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
    console.error("[CATEGORIES_POST]", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { error: error.errors[0].message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { error: "Failed to create category" },
      { status: 500 }
    );
  }
}