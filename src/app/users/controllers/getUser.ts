import { Err, Ok } from "@/config/result";
import { Request, Response } from "express";
import prisma from "@/config/prisma";
import { z } from "zod";

// TODO: finish implementation
export default async function getUser(req: Request, res: Response) {
  const { email: rawEmail } = req.query;
  const valid = validateEmail(rawEmail as string | undefined);
  if (!valid.ok) {
    res.status(400).send(valid);
    return;
  }

  const email = valid.value;
  const user = await prisma.user.findUnique({
    where: { email },
    select: { id: true, email: true, password: true },
  });

  if (!user) {
    res.status(404).send(Err("User not found", email));
    return;
  }

  res.status(200).send(Ok(user));
}

function validateEmail(rawEmail: string | undefined) {
  try {
    if (rawEmail) {
      const email = z.string().email().parse(rawEmail);
      return Ok(email);
    }
    return Err("Email is missing");
  } catch (e) {
    return Err("Invalid Email");
  }
}
