import { MyThing, myThing } from '@monorepo/shared-types';
import type { Request, Response, NextFunction } from 'express';
import type { Deps } from '../types';

export const Handlers = {
  'GET /': async () => (req: Request, res: Response) => {
    const thing: MyThing = myThing;
    const url = `${req.protocol}://${req.get('host')}${req.originalUrl}}`;
    res.json({ status: 'ok', timestamp: new Date().toISOString(), url, thing });
  },

  'GET /proxy': async (deps: Deps) => async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (req.query.error) {
        throw new Error('Error from my-microservice');
      }
      const response = await (await deps.fetch.fetch(deps.config.other.host)).json();
      res.json({ status: 'ok', timestamp: new Date().toISOString(), path: req.path, response });
    } catch (error) {
      next(error);
    }
  },

  errors: async () => async (err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(`Error in my-microservice:`, err);
    res.status(500).json({ status: 'error', error: err.message });
  },
};
