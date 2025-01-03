import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const product = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
      include: {
        category: true,
      },
    });

    if (!product) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_GET]", error);
    return new NextResponse(
      JSON.stringify({ error: "Internal server error" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PUT(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { status } = body;

    if (!status || !["active", "inactive"].includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: "Invalid status value" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingProduct) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found", id: params.id }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const product = await prisma.product.update({
      where: {
        id: params.id,
      },
      data: {
        status,
      },
      include: {
        category: true,
      },
    });

    return NextResponse.json(product);
  } catch (error) {
    console.error("[PRODUCT_PUT]", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update product status" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    if (!params.id) {
      return new NextResponse(
        JSON.stringify({ error: "Product ID is required" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();
    
    if (!body || typeof body !== 'object') {
      return new NextResponse(
        JSON.stringify({ error: "Invalid request body" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const { status, name, sku, categoryId, description, quantity, unit, minStock } = body;

    if (status !== undefined && !["active", "inactive"].includes(status)) {
      return new NextResponse(
        JSON.stringify({ error: "Status must be either 'active' or 'inactive'" }), 
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const existingProduct = await prisma.product.findUnique({
      where: { id: params.id },
      include: { category: true }
    });

    if (!existingProduct) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found" }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    const updatedProduct = await prisma.product.update({
      where: { id: params.id },
      data: {
        ...(status !== undefined && { status }),
        ...(name !== undefined && { name }),
        ...(sku !== undefined && { sku }),
        ...(categoryId !== undefined && { categoryId }),
        ...(description !== undefined && { description }),
        ...(quantity !== undefined && { quantity }),
        ...(unit !== undefined && { unit }),
        ...(minStock !== undefined && { minStock }),
      },
      include: { category: true }
    });

    return NextResponse.json(updatedProduct);
  } catch (error) {
    console.error("[PRODUCT_PATCH]", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to update product" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const existingProduct = await prisma.product.findUnique({
      where: {
        id: params.id,
      },
    });

    if (!existingProduct) {
      return new NextResponse(
        JSON.stringify({ error: "Product not found", id: params.id }), 
        { status: 404, headers: { 'Content-Type': 'application/json' } }
      );
    }

    await prisma.product.delete({
      where: {
        id: params.id,
      },
    });

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    console.error("[PRODUCT_DELETE]", error);
    return new NextResponse(
      JSON.stringify({ error: "Failed to delete product" }), 
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}
