const { send } = require('micro');
const createRouter = require('./router');

jest.mock('micro');

describe('router', () => {
  describe('.createRouter', () => {
    it('defines get method', () => {
      const router = createRouter();
      expect(router.get).toBeInstanceOf(Function);
    });

    it('defines post method', () => {
      const router = createRouter();
      expect(router.post).toBeInstanceOf(Function);
    });

    it('defines put method', () => {
      const router = createRouter();
      expect(router.put).toBeInstanceOf(Function);
    });

    it('defines patch method', () => {
      const router = createRouter();
      expect(router.patch).toBeInstanceOf(Function);
    });

    it('defines del method', () => {
      const router = createRouter();
      expect(router.del).toBeInstanceOf(Function);
    });

    it('defines head method', () => {
      const router = createRouter();
      expect(router.head).toBeInstanceOf(Function);
    });

    it('defines options method', () => {
      const router = createRouter();
      expect(router.options).toBeInstanceOf(Function);
    });

    it('adds default routes', () => {
      const router = createRouter();
      expect(router.routes.length).toEqual(2);
    });

    it('adds options route', () => {
      const router = createRouter();
      const [route] = router.routes;

      expect(route.method).toEqual('OPTIONS');
    });

    it('adds health route', () => {
      const router = createRouter();
      const [, route] = router.routes;

      expect(route.method).toEqual('GET');
      expect(route.pattern.stringify()).toEqual('/health');
    });

    describe('router', () => {
      let router;
      let handler;
      let data;

      beforeEach(() => {
        data = { some: 'data' };
        handler = jest.fn(() => data);
        router = createRouter().get('/test', handler);
      });

      it('returns 404 when invalid route', async () => {
        const req = { url: '/invalid', method: 'GET', headers: [] };
        const res = { setHeader: () => {} };
        const expectedPayload = {
          statusCode: 404,
          error: 'Not Found',
          message: 'URL does not exist',
        };
        await router(req, res);

        expect(send).toHaveBeenCalledWith(res, 404, expectedPayload);
      });

      it('sets response headers', async () => {
        const v4 = /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i;
        const req = { url: '/test', method: 'GET', headers: {} };
        const res = { setHeader: jest.fn() };
        await router(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-ID', expect.stringMatching(v4));
        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Max-Age', '86400');
        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
        expect(res.setHeader).toHaveBeenCalledWith(
          'Access-Control-Allow-Headers',
          'Accept,Authorization,Access-Control-Allow-Origin,Content-Type,X-Correlation-ID,X-HTTP-Method-Override,X-Requested-With'
        );
        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
      });

      it('sets correlation ID to supplied correlation ID', async () => {
        const req = { url: '/test', method: 'GET', headers: { 'x-correlation-id': '123' } };
        const res = { setHeader: jest.fn() };
        await router(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-ID', '123');
      });

      it('sets Access-Control-Expose-Headers if in options', async () => {
        router = createRouter({ cors: { exposeHeaders: ['abc', 'def'] } }).get('/test', handler);
        const req = { url: '/test', method: 'GET', headers: { 'x-correlation-id': '123' } };
        const res = { setHeader: jest.fn() };
        await router(req, res);

        expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Expose-Headers', 'abc,def');
      });

      it('returns null for OPTIONS', async () => {
        const req = { url: '/', method: 'OPTIONS', headers: {} };
        const res = { setHeader: jest.fn() };
        expect(await router(req, res)).toBeNull();
      });

      it('returns application info for /health', async () => {
        const req = { url: '/health', method: 'GET', headers: {} };
        const res = { setHeader: jest.fn() };
        const expected = { name: 'Unknown', description: '', host: 'unknown', dependencies: [], version: 'N/A' };

        expect(await router(req, res)).toEqual(expected);
      });
    });
  });
});
