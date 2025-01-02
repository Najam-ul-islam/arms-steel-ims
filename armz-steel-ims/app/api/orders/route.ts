import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { updateProductQuantity, OrderType, OrderStatus } from "@/lib/product-quantity";

function formatDate(date: Date) {
  const day = String(date.getDate()).padStart(2, '0'); 
  const month = String(date.getMonth() + 1).padStart(2, '0'); 
  const year = date.getFullYear(); 

  return `${day}-${month}-${year}`;
}

const currentDate = new Date();
const formattedDate = formatDate(currentDate);

export async function GET() {
  try {
    const orders = await prisma.order.findMany({
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return NextResponse.json({
      orders: orders || [], 
      totalOrders: orders.length, 
    });
    
  } catch (error) {
    console.error("[ORDERS_GET]", error);
    return new NextResponse("Internal error", { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, customerSupplier, status, items, notes } = body;
    const totalAmount = items.reduce(
      (sum: number, item: { quantity: number; unitPrice: number }) =>
        sum + item.quantity * item.unitPrice,
      0
    );

    // If the order is being created as COMPLETED, update product quantities
    if (status === "COMPLETED") {
      try {
        await updateProductQuantity(
          items.map((item: any) => ({
            productId: item.productId,
            quantity: item.quantity
          })),
          type as OrderType,
          null,
          status as OrderStatus
        );
      } catch (error: any) {
        return new NextResponse(error.message, { status: 400 });
      }
    }

    const uniqueId = Math.floor(Math.random() * 10000);
    const order = await prisma.order.create({
      data: {
        orderNumber: `${type === "PURCHASE" ? "PO" : "SO"}-${formattedDate}-${uniqueId}`,
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
    console.error("[ORDERS_POST]", error);
    if (error instanceof Error) {
      return new NextResponse(error.message, { status: 400 });
    }
    return new NextResponse("Internal error", { status: 500 });
  }
}