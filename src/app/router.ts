import { Router } from "express";
import userRouter from "./users/userRouter";

const appRouter = Router();

appRouter.use("/user", userRouter);

export default appRouter;
