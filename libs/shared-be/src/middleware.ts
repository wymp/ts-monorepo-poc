import type { RequestHandler } from 'express';

export const loggingMiddleware: (svc: string) => RequestHandler = (svc) => (req, res, next) => {
  console.log(`Request received for ${svc}: ${req.method} ${req.url}`);
  next();
};
