import React from 'react';
import { ApiClient } from './apiClient';
import type { Config } from './types';

export const assembleDeps = (config: Config) => {
  const deps = {
    config,
    apiClient: ApiClient(config),
  };
  return deps;
};

export type Deps = ReturnType<typeof assembleDeps>;

// I'm normally quite meticulous about types, but in cases like this where the app will basically always be started with
// the correct deps and you can depend on a catastrophic fast-fail if not, we can just any-cast for the default null
// value.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DepsContext = React.createContext<Deps>(null as any);

export const useDeps = () => React.useContext(DepsContext);
