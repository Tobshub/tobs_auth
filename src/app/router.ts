import { Router } from "express";
import userRouter from "./users/userRouter";
import { authWare } from "@/middlewares";
import appToken from "./token";

const appRouter = Router();

appRouter.use("/user", authWare, userRouter);
appRouter.use("/auth", (_, res) => {
  const newToken = appToken.generate();
  res.status(200).send(newToken);
});

export default appRouter;
