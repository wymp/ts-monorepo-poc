import * as Express from 'express';
import { Deps } from '../types';
import { getConfig } from './config';

/**
 * Assembling dependencies is often something that we'll want to be able to do in a variety of different contexts, so
 * we're wrapping it in a function that we can call from anywhere.
 */
export const assembleDeps = async (): Promise<Deps> => {
  const config = getConfig();
  const app = Express();
  return Object.freeze({
    app,
    config,
    fetch: { fetch },
  });
}

