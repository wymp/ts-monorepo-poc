import { fallthroughHandler, loggingMiddleware } from '../src/middleware';
import { FakeRequest, FakeResponse } from './fakes';

describe('middleware', () => {
  describe('loggingMiddleware', () => {
    test('should call next', async () => {
      const next = jest.fn();
      const req = new FakeRequest();
      const res = new FakeResponse();
      const middleware = loggingMiddleware('test');
      middleware(req as any, res as any, next);
      expect(next).toHaveBeenCalledWith();
    });
  });

  describe('fallthroughHandler', () => {
    test('should return 404', async () => {
      const next = jest.fn();
      const req: any = new FakeRequest({ method: 'POST', path: '/test' });
      const res: any = new FakeResponse();
      fallthroughHandler(req as any, res as any, next);
      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        status: 'error',
        error: `Endpoint ${req.method.toUpperCase()} ${req.path} Not found`,
      });
    });
  });
});
