import { Fetch } from '@monorepo/shared-types';
import type { Application } from 'express';

export type Config = {
  port: number;
  other: {
    host: string;
  };
};

export type Deps = Readonly<{
  app: Application;
  config: Config;
  fetch: Fetch;
}>;
