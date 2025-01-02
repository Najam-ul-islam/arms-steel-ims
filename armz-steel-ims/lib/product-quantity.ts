import { prisma } from "@/lib/prisma";

export type OrderType = "PURCHASE" | "SALES";
export type OrderStatus = "PENDING" | "COMPLETED" | "CANCELLED";

interface OrderItem {
  productId: string;
  quantity: number;
}

export async function updateProductQuantity(
  items: OrderItem[],
  orderType: OrderType,
  oldStatus: OrderStatus | null,
  newStatus: OrderStatus
) {
  try {
    // If order was previously completed, reverse the quantity changes
    if (oldStatus === "COMPLETED") {
      for (const item of items) {
        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              // Reverse the previous change
              increment: orderType === "SALES" ? item.quantity : -item.quantity,
            },
          },
        });
      }
    }

    // Apply new quantity changes if the new status is COMPLETED
    if (newStatus === "COMPLETED") {
      for (const item of items) {
        const product = await prisma.product.findUnique({
          where: { id: item.productId },
        });

        if (!product) {
          throw new Error(`Product not found: ${item.productId}`);
        }

        // For sales orders, decrease quantity
        // For purchase orders, increase quantity
        const quantityChange = orderType === "SALES" ? -item.quantity : item.quantity;

        // Check if we have enough stock for sales orders
        if (orderType === "SALES" && product.quantity < item.quantity) {
          throw new Error(
            `Insufficient stock for product ${product.name}. Available: ${product.quantity}, Required: ${item.quantity}`
          );
        }

        await prisma.product.update({
          where: { id: item.productId },
          data: {
            quantity: {
              increment: quantityChange,
            },
          },
        });
      }
    }

    return true;
  } catch (error) {
    console.error("Error updating product quantities:", error);
    throw error;
  }
}
