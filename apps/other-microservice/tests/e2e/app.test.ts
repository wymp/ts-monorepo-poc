import { assembleDeps } from '../../src/deps/prodDeps';
import { initApp } from '../../src/init';

describe(`my-microservice e2e`, () => {
  let deps: Awaited<ReturnType<typeof assembleDeps>>;
  let shutdown: () => Promise<void>;
  const port = '11235';

  // Before all tests, start the server up with our dependencies (in this case the same as prod)
  beforeAll(async () => {
    process.env.PORT = port;
    deps = await assembleDeps();
    shutdown = await initApp(deps);
  });

  // After all tests, shut the server down again
  afterAll(async () => {
    await shutdown();
  });

  test('GET /', async () => {
    const res = await fetch(`http://localhost:${port}`);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      url: expect.any(String),
    });
  });

  test('Error handling', async () => {
    const res = await fetch(`http://localhost:${port}?error=true`);
    expect(res.status).toBe(500);
    expect(await res.json()).toMatchObject({
      status: 'error',
      error: expect.any(String),
    });
  });

  test('404 handling', async () => {
    const res = await fetch(`http://localhost:${port}/not-found`);
    expect(res.status).toBe(404);
    expect(await res.json()).toMatchObject({
      status: 'error',
      error: `Endpoint GET /not-found Not found`,
    });
  });
});
