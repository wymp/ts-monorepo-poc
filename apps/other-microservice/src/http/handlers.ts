import type { Request, Response, NextFunction } from 'express';

export const Handlers = {
  'GET /': async () => (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query.error) {
        throw new Error(`Error in other-microservice`);
      }
      const url = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
      res.json({
        status: 'ok',
        timestamp: new Date().toISOString(),
        url,
      });
    } catch (e) {
      next(e);
    }
  },

  errors: async () => async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error in other-microservice:`, err);
    res.status(500).json({ status: 'error', error: err.message });
  },
};
