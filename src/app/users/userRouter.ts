import { Router } from "express";
import addUser from "./controllers/addUser";
import getUser from "./controllers/getUser";

const userRouter = Router();

// get user
userRouter.get("/", getUser);

// add user
userRouter.post("/", addUser);

// delete user
//
// update user

export default userRouter;
