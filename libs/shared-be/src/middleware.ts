import type { RequestHandler } from 'express';

export const loggingMiddleware: (svc: string) => RequestHandler = (svc) => (req, res, next) => {
  console.log(`Request received for ${svc}: ${req.method} ${req.url}`);
  next();
};

export const fallthroughHandler: RequestHandler = (req, res) => {
  res.status(404).json({ status: 'error', error: `Endpoint ${req.method.toUpperCase()} ${req.path} Not found` });
};
