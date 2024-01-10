export const ApiClient = (config: { api: { baseUrl: string } }) => ({
  get: async <T = unknown>(path: string) => {
    const res = await fetch(`${config.api.baseUrl}${path}`);
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Failed to fetch ${path}: ${res.status}: ${body}`);
    }
    return (await res.json()) as T;
  },
});
