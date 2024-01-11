import type { Fetch } from "@monorepo/shared-types";

export type FakeFetchResponse = { status?: number; jsonBody?: string };

export type FakeFetchResponseQueue = Record<
  string,
  Array<FakeFetchResponse>
>

export class FakeFetch implements Fetch {
  public defaultResponse: FakeFetchResponse = {
    status: 200,
    jsonBody: '{"status":"ok"}',
  };
  public queue: FakeFetchResponseQueue = {};
  public async fetch(url: string) {
    const response = this.queue[url]?.shift() || this.defaultResponse;
    return {
      status: response.status || 200,
      json: async () => JSON.parse(response.jsonBody || ''),
      text: async () => response.jsonBody || '',
    }
  }
}