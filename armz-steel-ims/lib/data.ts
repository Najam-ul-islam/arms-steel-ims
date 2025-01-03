import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  const totalProducts = await prisma.product.count();

  const lowStock = await prisma.product.count({
    where: {
      quantity: {
        lte: prisma.product.fields.minStock,
      },
    },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [inboundToday, outboundToday] = await Promise.all([
    prisma.transaction.count({
      where: {
        type: "INBOUND",
        createdAt: {
          gte: today,
        },
      },
    }),
    prisma.transaction.count({
      where: {
        type: "OUTBOUND",
        createdAt: {
          gte: today,
        },
      },
    }),
  ]);

  return {
    totalProducts,
    lowStock,
    inboundToday,
    outboundToday,
  };
}

export async function getChartData() {
  const dates = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - i);
    date.setHours(0, 0, 0, 0);
    return date;
  }).reverse();

  const chartData = await Promise.all(
    dates.map(async (date) => {
      const nextDate = new Date(date);
      nextDate.setDate(date.getDate() + 1);

      const [inbound, outbound] = await Promise.all([
        prisma.transaction.count({
          where: {
            type: "INBOUND",
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
        prisma.transaction.count({
          where: {
            type: "OUTBOUND",
            createdAt: {
              gte: date,
              lt: nextDate,
            },
          },
        }),
      ]);

      return {
        date: date.toLocaleDateString("en-US", { month: "short", day: "numeric" }),
        inbound,
        outbound,
      };
    })
  );

  return chartData;
}