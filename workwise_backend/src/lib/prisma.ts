import { PrismaClient } from "@prisma/client";

declare global {
  // Correctly extend the globalThis interface
  namespace NodeJS {
    interface Global {
      prisma?: PrismaClient;
    }
  }

  // Or extend globalThis (preferred in newer TypeScript versions)
  var prisma: PrismaClient | undefined;
}

const prisma = global.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") global.prisma = prisma;

export { prisma };
