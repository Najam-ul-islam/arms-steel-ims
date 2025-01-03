import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create categories
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Steel Bars',
        description: 'Various types of steel bars and rods',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Steel Plates',
        description: 'Flat steel plates and sheets',
      },
    }),
    prisma.category.create({
      data: {
        name: 'Steel Pipes',
        description: 'Hollow steel pipes and tubes',
      },
    }),
  ]);

  // Create products
  await Promise.all(
    categories.map((category) =>
      prisma.product.create({
        data: {
          name: `${category.name.slice(0, -1)} Sample`,
          sku: `${category.name.slice(0, 2).toUpperCase()}${Date.now()}`,
          categoryId: category.id,
          quantity: 100,
          unit: 'pcs',
          minStock: 20,
          description: `Sample ${category.name.toLowerCase()}`,
        },
      })
    )
  );

  console.log('Database seeded successfully');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });