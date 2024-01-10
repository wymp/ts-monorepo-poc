import type { Config } from '../types';

export const getConfig = (): Config => ({
  port: Number(process.env.PORT) || 4000,
});
