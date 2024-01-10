import { assembleDeps } from './deps/prodDeps';
import { initApp } from './init';

// Set the app up to gracefully handle shutdowns

let shutdown: () => Promise<void>;

const close = async (e: unknown) => {
  if (typeof e === 'string') {
    console.log(`Signal '${e}' received. Shutting down...`);
  } else {
    console.error(e);
  }
  await shutdown();
};

process.on('SIGTERM', close);
process.on('SIGINT', close);
process.on('unhandledRejection', close);

// Now assemble our production dependencies and initialize the app with them

(async () => {
  const deps = await assembleDeps();
  shutdown = await initApp(deps);
})();
