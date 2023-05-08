import { Router } from "express";
import userRouter from "./users/userRouter";
import { adminCheck, authWare } from "@/middlewares";
import { appToken } from "./token";
import loginController from "./login";

const appRouter = Router();

appRouter.use("/user", authWare, userRouter);
// - login route to get token with credentials, web page to register services and get app tokens will use this
appRouter.post("/login", loginController);
// - /token route should have a userAuth middleware that makes sure that a valid user token is present to get an app token
appRouter.get("/token", adminCheck, (_, res) => {
  const newToken = appToken.generate();
  res.status(200).send(newToken);
});

export default appRouter;
