import { Ok } from "@/config/result";
import { Request, Response } from "express";

export default async function getUser(req: Request, res: Response) {
  const { email } = req.query;
  const id = req.headers.serviceId;
  res.send(Ok({ email, id }));
}
