import type { Request, Response, NextFunction } from "express";

export const Middleware = {
  cors: (req: Request, res: Response, next: NextFunction) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    next();
  }
}
