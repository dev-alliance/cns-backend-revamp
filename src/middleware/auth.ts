import { Request, Response, NextFunction } from "express";
import config from "config";
import jwt from "jsonwebtoken";
import { ERROR_CODES } from "../../constants/errorCodes";

export const auth = (req: Request, res: Response, next: NextFunction) => {
  const token = req.header("x-auth-token");
  if (!token) return res.status(401).send(ERROR_CODES.AUTH.ACCESS_TOKEN);

  try {
    const decoded = jwt.verify(token, config.get("jwtPrivateKey"));
    req?.user = decoded;
    next();
  } catch (ex) {
    res.status(400).send("Invalid token");
  }
};
