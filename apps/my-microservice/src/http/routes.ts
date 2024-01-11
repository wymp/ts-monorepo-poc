import { fallthroughHandler, loggingMiddleware } from '@monorepo/shared-be';
import { Middleware } from './middleware';
import { Handlers } from './handlers';
import { Deps } from "../types";

export const connectRoutes = async (deps: Deps) => {
  const { app } = deps;

  app.use(loggingMiddleware(`my-microservice`));
  app.use(Middleware.cors);

  app.get('/', await Handlers["GET /"]());
  app.get('/proxy', await Handlers["GET /proxy"](deps));

  app.all('*', fallthroughHandler);

  app.use(await Handlers.errors());
}
