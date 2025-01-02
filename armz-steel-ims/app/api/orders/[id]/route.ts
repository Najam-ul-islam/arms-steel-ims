import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProductQuantity, OrderType, OrderStatus } from "@/lib/product-quantity";

export async function GET(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const order = await prisma.order.findUnique({
      where: {
        id: params.id,
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!order) {
      return new NextResponse("Order not found", { status: 404 });
    }

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    // Get the current order to check its status
    const currentOrder = await prisma.order.findUnique({
      where: { id: params.id },
      include: { 
        items: {
          include: {
            product: true
          }
        } 
      },
    });

    if (!currentOrder) {
      return new NextResponse("Order not found", { status: 404 });
    }

    const body = await req.json();
    const { type, customerSupplier, status, items, notes } = body;

    // Update product quantities based on status change
    try {
      await updateProductQuantity(
        items.map((item: any) => ({
          productId: item.productId,
          quantity: item.quantity
        })),
        type as OrderType,
        currentOrder.status as OrderStatus,
        status as OrderStatus
      );
    } catch (error: any) {
      return new NextResponse(error.message, { status: 400 });
    }

    const totalAmount = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    // Delete existing items
    await prisma.orderItem.deleteMany({
      where: {
        orderId: params.id,
      },
    });
    
    // Update order and create new items
    const order = await prisma.order.update({
      where: {
        id: params.id,
      },
      data: {
        type,
        status,
        [type === "PURCHASE" ? "supplier" : "customer"]: customerSupplier,
        totalAmount,
        notes,
        items: {
          create: items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            totalPrice: item.quantity * item.unitPrice,
          })),
        },
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    return NextResponse.json(order);
  } catch (error) {
    console.error("[ORDER_PATCH]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const id = params.id;

  try {
      // Ensure the record exists
      const order = await prisma.order.findUnique({ where: { id } });
      if (!order) {
          return new Response("Order not found", { status: 404 });
      }

      // Delete related order items first to maintain referential integrity
      await prisma.orderItem.deleteMany({ where: { orderId: id } });

      // Delete the order
      await prisma.order.delete({ where: { id } });
      return new Response("Order deleted successfully", { status: 200 });
  } catch (error) {
      console.error("Error deleting order:", error);
      return new Response("Failed to delete order", { status: 500 });
  }
}
