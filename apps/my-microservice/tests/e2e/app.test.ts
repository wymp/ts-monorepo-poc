import { assembleDeps } from '../../src/deps/testDeps';
import { initApp } from '../../src/init';

describe(`my-microservice e2e`, () => {
  let deps: Awaited<ReturnType<typeof assembleDeps>>;
  let shutdown: () => Promise<void>;
  const port = '11234';

  // Before all tests, start the server up with our testing dependencies
  beforeAll(async () => {
    process.env.PORT = port;
    deps = await assembleDeps();
    shutdown = await initApp(deps);
  });

  // After all tests, shut the server down again
  afterAll(async () => {
    await shutdown();
  });

  // Before each test, clear out the fetch queue
  beforeEach(() => {
    deps.fetch.queue = {};
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

  test('GET /proxy', async () => {
    deps.fetch.queue['http://localhost:4000'] = [{ status: 200, jsonBody: JSON.stringify({ test: 'ok' }) }];
    const res = await fetch(`http://localhost:${port}/proxy`);
    expect(res.status).toBe(200);
    expect(await res.json()).toMatchObject({
      status: 'ok',
      timestamp: expect.any(String),
      path: expect.any(String),
      response: { test: 'ok' },
    });
  });

  test('Error handling', async () => {
    const res = await fetch(`http://localhost:${port}/proxy?error=true`);
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
