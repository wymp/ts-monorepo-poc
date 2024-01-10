import * as Http from './http';
import { Deps } from './types';

/**
 * Defining _how_ we initialize our application separately from the dependencies we use to do it allows us to initialize
 * the app in the exact same way in testing vs production, but with different (usually fake) dependencies.
 *
 * @returns A function that can be used to shut down the app when we're done with it
 */
export const initApp = async (deps: Deps) => {
  // Connect all our HTTP routes
  Http.connectRoutes(deps);

  // Listen for HTTP requests
  const server = deps.app.listen(deps.config.port);

  // Output a friendly log on success
  console.log(`my-microservice listening on port ${deps.config.port}`);

  // Return a "shutdown" function that we can use to close the server and other resources when we're done
  return async () => {
    server.close();
  };
};
