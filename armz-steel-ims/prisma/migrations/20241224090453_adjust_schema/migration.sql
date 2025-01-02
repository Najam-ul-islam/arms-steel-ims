-- AlterTable
ALTER TABLE "Category" ALTER COLUMN "description" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "customer" SET DEFAULT '',
ALTER COLUMN "supplier" SET DEFAULT '',
ALTER COLUMN "notes" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Product" ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'active',
ALTER COLUMN "description" SET DEFAULT '',
ALTER COLUMN "location" SET DEFAULT '';

-- AlterTable
ALTER TABLE "Transaction" ALTER COLUMN "notes" SET DEFAULT '';
