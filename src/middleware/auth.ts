import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send("Access Denied. No token provided");

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req?.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
