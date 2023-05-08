import { appToken } from "@/app/token";
import logger from "@/config/logger";
import { Err } from "@/config/result";
import { Request, Response, NextFunction } from "express";

export default async function authWare(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const { authorization } = req.headers;
  // Bearer {Token}
  const token = authorization?.split(" ")[1];
  const { isValid, serviceId } = validateToken(token);

  if (!isValid) {
    logger.warn("Received request with invalid token");
    res
      .status(401)
      .send(
        Err(
          "Invalid Authorization Token",
          token ? undefined : "Token is missing"
        )
      );
    return;
  }

  req.headers.serviceId = serviceId;
  next();
}

function validateToken(token: string | undefined) {
  const res: { isValid: boolean; serviceId: string | undefined } = {
    isValid: false,
    serviceId: undefined,
  };
  if (token) {
    const data = appToken.vaildate(token);
    if (data.ok) {
      res.isValid = data.ok;
      res.serviceId = data.value;
    }
  }
  return res;
}
