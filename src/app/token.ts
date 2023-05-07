import logger from "@/config/logger";
import { Err, Ok } from "@/config/result";
import jwt from "jsonwebtoken";
import { ObjectId } from "bson";

const jwtSecret = process.env.JWT_SECRET as string;

const appToken = {
  generate: () => {
    const hex = new ObjectId();
    const token = jwt.sign(hex.toString(), jwtSecret);
    return Ok(token);
  },
  vaildate: (token: string) => {
    try {
      const data = jwt.verify(token, jwtSecret);
      return Ok(data as string);
    } catch (e) {
      logger.warn("Token verification failed", e);
      return Err("Failed to verify token");
    }
  },
};

export default appToken;
