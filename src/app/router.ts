import { Router } from "express";
import userRouter from "./users/userRouter";
import { authWare } from "@/middlewares";
import appToken from "./token";

const appRouter = Router();

appRouter.use("/user", authWare, userRouter);
// FIXIT:
// user token is the token for interacting with this service manually
// app token is the token for interacting with this service from another service
// - login route to get token with credentials, web page to register services and get app tokens will use this
// - /token route should have a userAuth middleware that makes sure that a valid user token is present to get an app token
appRouter.get("/token", (_, res) => {
  const newToken = appToken.generate();
  res.status(200).send(newToken);
});

export default appRouter;
