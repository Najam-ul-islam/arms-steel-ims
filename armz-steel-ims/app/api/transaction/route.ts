import { NextResponse } from "next/server";
import { NextApiRequest, NextApiResponse } from "next";
// import { prisma } from "@/lib/prisma";
import { z } from "zod";

import { PrismaClient } from "@prisma/client";

const querySchema = z.object({
  page: z.string().transform(Number).default("1"),
  limit: z.string().transform(Number).default("10"),
  sortBy: z.enum(["date", "amount"]).default("date"),
  sortOrder: z.enum(["asc", "desc"]).default("desc"),
  type: z.enum(["INBOUND", "OUTBOUND", "ADJUSTMENT"]).optional(),
});

// export async function GET(request: Request) {
//   try {
//     const { searchParams } = new URL(request.url);
//     const validatedParams = querySchema.parse(Object.fromEntries(searchParams));
//     const { page, limit, sortBy, sortOrder, type } = validatedParams;

//     const skip = (page - 1) * limit;
    
//     const where = type ? { type } : {};
    
//     const [transactions, total] = await Promise.all([
//       prisma.transaction.findMany({
//         skip,
//         take: limit,
//         where,
//         include: {
//           product: true,
//         },
//         orderBy: {
//           [sortBy === "date" ? "createdAt" : "quantity"]: sortOrder,
//         },
//       }),
//       prisma.transaction.count({ where }),
//     ]);

//     return NextResponse.json({
//       transactions,
//       pagination: {
//         total,
//         pages: Math.ceil(total / limit),
//         currentPage: page,
//       },
//     });
//   } catch (error) {
//     console.error("[TRANSACTIONS_GET]", error);
//     return NextResponse.json(
//       { error: "Failed to fetch transactions" },
//       { status: 500 }
//     );
//   }
// }









// import { PrismaClient } from "@prisma/client";



// const prisma = new PrismaClient();

// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   if (req.method === "GET") {
//     const transactions = await prisma.transaction.findMany();
//     res.status(200).json(transactions);
//   } else if (req.method === "POST") {
//     const { type, productId, quantity, reference, notes } = req.body;
//     if (!type || !productId || !quantity || !reference) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     const newTransaction = await prisma.transaction.create({
//       data: { type, productId, quantity, notes },
//     });
//     res.status(201).json(newTransaction);
//   }
// }



// export default async function handler(req: NextApiRequest, res: NextApiResponse) {
//   console.log("API route hit with method:", req.method);
//   if (req.method === "GET") {
//     const transactions = await prisma.transaction.findMany();
//     res.status(200).json(transactions);
//   } else if (req.method === "POST") {
//     console.log("Processing POST request");
//     const { type, productId, quantity, reference, notes } = req.body;
//     console.log("Received data:", { type, productId, quantity, reference, notes });
//     if (!type || !productId || !quantity || !reference) {
//       return res.status(400).json({ error: "Missing required fields" });
//     }
//     const newTransaction = await prisma.transaction.create({
//       data: { type, productId, quantity, notes },
//     });
//     res.status(201).json(newTransaction);
//   } else {
//     // Fallback for unsupported methods
//     res.setHeader("Allow", ["GET", "POST"]);
//     res.status(405).json({ error: `Method ${req.method} Not Allowed` });
//   }
// }



const prisma = new PrismaClient();

// Handle POST requests
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { type, productId, quantity, reference, notes } = body;

    if (!type || !productId || !quantity || !reference) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newTransaction = await prisma.transaction.create({
      // data: { type, productId, quantity, reference, notes },
      data: { type, productId, quantity,  notes },
    });

    return NextResponse.json(newTransaction, { status: 201 });
  } catch (error) {
    console.error("Error in POST /api/transaction:", error);
    return NextResponse.json({ error: "Failed to create transaction" }, { status: 500 });
  }
}

// Handle GET requests (if needed)
// export async function GET() {
//   try {
//     const transactions = await prisma.transaction.findMany();
//     return NextResponse.json(transactions, { status: 200 });
//   } catch (error) {
//     console.error("Error in GET /api/transaction:", error);
//     return NextResponse.json({ error: "Failed to fetch transactions" }, { status: 500 });
//   }
// }




// import { NextResponse } from "next/server";
// import { PrismaClient } from "@prisma/client";

// const prisma = new PrismaClient();

export async function GET() {
  try {
    // Fetch all transactions from the database
    const transactions = await prisma.order.findMany({
      select: {
        id: true,
        createdAt: true,
        type: true,
        orderNumber: true,
        totalAmount: true,
      },
      orderBy: {
        createdAt: "desc", // Sort transactions by creation date, most recent first
      },
    });

    return NextResponse.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    return NextResponse.json(
      { error: "Failed to fetch transactions" },
      { status: 500 }
    );
  } finally {
    await prisma.$disconnect();
  }
}




