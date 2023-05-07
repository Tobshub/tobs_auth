import logger from "@/config/logger";
import prisma from "@/config/prisma";
import { z } from "zod";
import { Request, Response } from "express";
import { Err, Ok } from "@/config/result";

export default async function addUser(req: Request, res: Response) {
  try {
    const { user: data } = await req.body;
    const zodTest = z.object({
      email: z.string().email(),
      password: z.string().min(8).max(64),
    });

    const user = zodTest.parse(data);

    const checkUser = await prisma.user.findUnique({
      where: { email: user.email },
      select: { id: true },
    });

    if (checkUser) {
      logger.warn("User already exists");
      res.status(400).send(Err("User already exists"));
      return;
    }

    const createUser = await prisma.user.create({
      data: { email: user.email, password: user.password },
      select: { id: true },
    });

    if (!createUser || !createUser.id) {
      logger.error("Failed to create user");
      res.status(500).send(Err("Failed to create user"));
      return;
    }

    logger.info(user, "Login success");
    res.status(200).send(Ok(createUser));
  } catch (e) {
    logger.error(e);
    res.send(Err("An error occured"));
  }
}
