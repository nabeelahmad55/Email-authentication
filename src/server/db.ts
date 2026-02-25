import { PrismaClient } from "@prisma/client";

import { env } from "~/server/env";

const createPrismaClient = () =>
  new PrismaClient({
    log:
      env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

// Only initialize Prisma if DATABASE_URL is provided
// Otherwise, we rely solely on Airtable for persistence
// export const db = env.DATABASE_URL
//   ? (globalForPrisma.prisma ?? createPrismaClient())
//   : null;

// if (env.NODE_ENV !== "production" && db) {
//   globalForPrisma.prisma = db;
// }
if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

export const db =
  globalForPrisma.prisma ?? createPrismaClient();

if (env.NODE_ENV !== "production") {
  globalForPrisma.prisma = db;
}
