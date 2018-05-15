const log = require('bristol');
const { handleLogging } = require('./logger');

describe('logger', () => {
  describe('.handleLogging', () => {
    const req = { url: '/test', method: 'GET', headers: { 'x-test': 'abc' }, ignored: 'ignored' };
    const res = {};

    beforeEach(() => {
      log.info = jest.fn();
    });

    it('logs request', async () => {
      await handleLogging(() => {})(req, res);

      expect(log.info).toHaveBeenCalledWith('Incoming request', {
        req: { url: req.url, method: req.method, headers: req.headers },
      });
    });

    it('calls handler', async () => {
      const handler = jest.fn();
      await handleLogging(handler)(req, res);
      expect(handler).toHaveBeenCalledWith(req, res);
    });
  });
});
