import { NextFunction, Request, Response } from "express";
const admdin = '';
console.log('er')
export default function (req: Request, res: Response, next: NextFunction) {
  // req.user set by auth middleware
  if (!req) return res.status(403);
  next();
}
