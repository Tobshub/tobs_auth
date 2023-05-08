import logger from "@/config/logger";
import { Err, Ok } from "@/config/result";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

const appSecret = process.env.JWT_SECRET as string;

export const appToken = {
  generate: () => {
    const hex = new ObjectId();
    const token = jwt.sign(hex.toString(), appSecret);
    return Ok(token);
  },
  vaildate: (token: string) => {
    try {
      const data = jwt.verify(token, appSecret);
      return Ok(data as string);
    } catch (e) {
      logger.warn("Token verification failed", e);
      return Err("Failed to verify token");
    }
  },
};

const adminSecret = process.env.ADMIN_SECRET as string;

export const adminToken = {
  generate: () => {
    const hex = new ObjectId();
    const token = jwt.sign(hex.toString(), adminSecret);
    return Ok(token);
  },
  vaildate: (token: string) => {
    try {
      const data = jwt.verify(token, adminSecret);
      return Ok(data as string);
    } catch (e) {
      logger.warn("Admin token verification failed", e);
      return Err("Failed to verify token");
    }
  },
}
