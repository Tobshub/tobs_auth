import logger from "@/config/logger";
import { Err, Ok } from "@/config/result";
import { Request, Response } from "express";
import z from "zod";
import { adminToken } from "../token";

type User = { email: string; password: string };

export default async function loginController(req: Request, res: Response) {
  const { user: rawUser } = await req.body;
  const user = await validateLoginInput(rawUser).then((res) => {
    if (res.ok) {
      return res.value;
    }
    return null;
  });

  if (!user) {
    logger.warn("Login attempt without user object");
    res.status(400).send(Err("Login Failed", "User object is missing"));
    return;
  }

  const valid = verfiyUser(user);

  if (valid.ok) {
    res.status(200).send(valid);
    return;
  }

  res.status(401).send(valid);
}

function verfiyUser(user: User) {
  const actualUser: User = {
    email: process.env.ADMIN_EMAIL as string,
    password: process.env.ADMIN_PASSWORD as string,
  };

  if (
    actualUser.email.toLowerCase() === user.email.toLowerCase() &&
    actualUser.password === user.password
  ) {
    const token = adminToken.generate();
    return token;
  }

  logger.warn("Login attempt with wrong credentials");
  return Err("Email or Password is wrong");
}

async function validateLoginInput(user: User) {
  try {
    const test = z.object({ email: z.string().email(), password: z.string() });
    const validatedInput = test.parse(user);
    return Ok(validatedInput);
  } catch (e) {
    return Err("Invalid input");
  }
}
