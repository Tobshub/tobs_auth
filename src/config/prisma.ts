import { PrismaClient } from "@prisma/client";
import logger from "./logger";
import { Err, Ok } from "./result";

const prisma = new PrismaClient();
export default prisma;

export async function dbConn() {
  try {
    logger.info("Prisma client connecting...");
    await prisma.$connect();
    logger.info("Prisma client connected");
    return Ok();
  } catch (err) {
    logger.error(err, "Database connection failed");
    return Err();
  }
}
