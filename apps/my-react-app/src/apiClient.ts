import type { Fetch } from '@monorepo/shared-types';
import type { Config, Deps } from './types';

export const ApiClient = ({ config, fetch }: { config: Config; fetch: Fetch }): Deps['apiClient'] => ({
  get: async <T = unknown>(path: string) => {
    const res = await fetch.fetch(`${config.api.baseUrl}${path}`);
    if (res.status > 399) {
      const body = await res.text();
      throw new Error(`Failed to fetch ${path}: ${res.status}: ${body}`);
    }
    return (await res.json()) as T;
  },
});
