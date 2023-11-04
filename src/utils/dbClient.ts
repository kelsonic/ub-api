// Node modules.
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Add a listener for the SIGINT signal (usually triggered by Ctrl+C)
// to ensure that the Prisma client is cleanly disconnected when the application is about to exit.
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  process.exit(0);
});

export default prisma;
