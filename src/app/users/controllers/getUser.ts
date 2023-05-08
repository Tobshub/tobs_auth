import { Ok } from "@/config/result";
import { Request, Response } from "express";

// TODO: finish implementation
export default async function getUser(req: Request, res: Response) {
  const { email } = req.query;
  const id = req.headers.serviceId;
  res.status(200).send(Ok({ email, id }));
}
