import { PrismaClient } from "@prisma/client";
import logger from "./logger";

export const prisma = new PrismaClient();

export async function dbConn() {
  try {
    logger.info("Prisma client connecting...");
    await prisma.$connect();
    logger.info("Prisma client connected");
  } catch (err) {
    logger.error(err, "Database connection failed");
  }
}
