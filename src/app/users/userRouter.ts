import logger from "@/config/logger";
import prisma from "@/config/prisma";
import { Err, Ok } from "@/config/result";
import { Router } from "express";
import { z } from "zod";

const userRouter = Router();

// get user
userRouter.get("/", (req, res) => {
  const { email } = req.query;
  const id = req.headers.serviceId;
  res.send(Ok({ email, id }));
});

// add user
userRouter.post("/", async (req, res) => {
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
});

// delete user
//
// update user

export default userRouter;
