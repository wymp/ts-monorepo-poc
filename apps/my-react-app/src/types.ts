export type ApiClient = {
  get<T>(path: string): Promise<T>;
};

export type Config = Readonly<{
  api: {
    baseUrl: string;
  };
}>;

export type Deps = Readonly<{
  apiClient: ApiClient;
  config: Config;
}>;
