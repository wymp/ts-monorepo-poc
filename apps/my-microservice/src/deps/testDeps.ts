import { FakeFetch } from '@monorepo/testing';
import * as Express from 'express';
import { Deps } from '../types';
import { getConfig } from './config';

/**
 * Our testing dependencies are all our production deps, but with a fake fetch
 */
type FakeDeps = Readonly<Deps & { fetch: FakeFetch }>;

export const assembleDeps = async (): Promise<FakeDeps> => {
  const config = getConfig();
  const app = Express();
  return Object.freeze({
    app,
    config,
    fetch: new FakeFetch(),
  });
};
