import { Router } from "express";
import userRouter from "./users/userRouter";
import { authWare } from "@/middlewares";

const appRouter = Router();

appRouter.use("/user", authWare, userRouter);
appRouter.use("/auth", (_, res) => {
  
})

export default appRouter;
