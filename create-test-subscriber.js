const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function main() {
  const testEmail = 'test@example.com';

  try {
    // Check if subscriber already exists
    let subscriber = await prisma.subscriber.findUnique({
      where: { email: testEmail },
    });

    if (subscriber) {
      console.log('Subscriber already exists:', subscriber.email);
    } else {
      // Create a new subscriber
      subscriber = await prisma.subscriber.create({
        data: {
          email: testEmail,
          active: true,
          source: 'test',
          unsubscribeToken: 'test-token-' + Date.now(),
        },
      });
      console.log('Created new subscriber:', subscriber.email);
    }

    console.log('Subscriber status:', subscriber.active ? 'active' : 'inactive');
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    await prisma.$disconnect();
  }
}

main();
