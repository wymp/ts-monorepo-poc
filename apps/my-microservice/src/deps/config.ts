import type { Config } from "../types";

export const getConfig = (): Config => ({
  port: Number(process.env.PORT) || 3000,
  other: {
    host: process.env.OTHER_HOST || 'http://localhost:4000',
  },
});
