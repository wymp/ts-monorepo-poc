export type FetchResponse = {
  status: number;
  json: () => Promise<unknown>;
  text: () => Promise<string>;
};

export interface Fetch {
  fetch(url: string): Promise<FetchResponse>;
}
