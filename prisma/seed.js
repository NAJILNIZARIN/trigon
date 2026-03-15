const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  await prisma.breakdown.deleteMany();
  await prisma.item.deleteMany();
  await prisma.category.deleteMany();
  await prisma.department.deleteMany();

  const dept1 = await prisma.department.create({
    data: { name: 'Electronics' }
  });
  
  const cat1 = await prisma.category.create({
    data: { name: 'Computers', departmentId: dept1.id }
  });
  const cat2 = await prisma.category.create({
    data: { name: 'Smartphones', departmentId: dept1.id }
  });
  
  const dept2 = await prisma.department.create({
    data: { name: 'Furniture' }
  });
  
  const cat3 = await prisma.category.create({
    data: { name: 'Desks', departmentId: dept2.id }
  });
  
  const item1 = await prisma.item.create({
    data: {
      name: 'Macbook Pro 16',
      departmentId: dept1.id,
      categoryId: cat1.id,
      basePrice: 2000,
      margin: 15, // 15%
      finalPrice: 2000 + (2000 * 0.15),
      status: 'Active',
      breakdowns: {
        create: [
          { name: 'Manufacturing', amount: 1500 },
          { name: 'Shipping', amount: 500 }
        ]
      }
    }
  });

  const item2 = await prisma.item.create({
    data: {
      name: 'Standing Desk Pro',
      departmentId: dept2.id,
      categoryId: cat3.id,
      basePrice: 500,
      margin: 30, // 30%
      finalPrice: 500 + (500 * 0.30),
      status: 'Active',
      breakdowns: {
        create: [
          { name: 'Materials', amount: 250 },
          { name: 'Labor', amount: 150 },
          { name: 'Shipping', amount: 100 }
        ]
      }
    }
  });

  console.log('Seeding finished.');
}

main()
  .then(async () => { await prisma.$disconnect() })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
