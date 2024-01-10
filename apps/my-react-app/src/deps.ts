import React from 'react';
import { ApiClient } from './apiClient';
import type { Config, Deps } from './types';

/**
 * This current implementation doesn't need to be async, but it's useful to show how you might handle it if it did need
 * to be async, so we're calling it async anyway.
 */
export const assembleDeps = async (config: Config): Promise<Deps> => {
  return Object.freeze({
    apiClient: ApiClient({
      config,
      fetch: {
        fetch: (url: string) => fetch(url),
      },
    }),
    config,
  });
};

// I'm normally quite meticulous about types, but in cases like this where the app will basically always be started with
// the correct deps and you can depend on a catastrophic fast-fail if not, we can just any-cast to pretend the value
// will never be null.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const DepsContext = React.createContext<Deps>(null as any);

export const useDeps = () => React.useContext(DepsContext);
