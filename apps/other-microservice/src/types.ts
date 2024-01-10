import type { Application } from 'express';

export type Config = {
  port: number;
};

export type Deps = Readonly<{
  app: Application;
  config: Config;
}>;
