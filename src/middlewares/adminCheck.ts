import { adminToken } from "@/app/token";
import logger from "@/config/logger";
import { Err } from "@/config/result";
import { Request, Response, NextFunction } from "express";

export default async function adminCheck(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  // Bearer {Token}
  const token = authorization?.split(" ")[1];

  if (!token) {
    logger.warn("Tried to get app token without admin token");
    res.status(401).send(Err("Admin token is missing"));
    return;
  }

  const { ok } = adminToken.vaildate(token);

  if (!ok) {
    logger.warn("Tried to get app token with invalid admin token");
    res.status(401).send(Err("Invalid Admin Token"));
    return;
  }

  next();
}
