const bristol = require('bristol');

const { createLogger, getLogger, setLogger, handleLogging } = require('./logging');
const DEFAULT_OPTIONS = require('./options');

describe('logging', () => {
  beforeEach(() => {
    setLogger(null);
  });

  describe('.createLogger', () => {
    it('creates logger when no options', () => {
      const logger = createLogger();
      expect(logger).toBeInstanceOf(bristol.Bristol);
    });

    it('sets correlationId global', () => {
      const logger = createLogger();
      expect(logger._globals.correlationId).toBeInstanceOf(Function);
    });

    it('sets application global', () => {
      const options = {
        application: {
          name: 'test',
          host: 'blah',
          version: '1.2.3',
          ignored: 'ignored',
        },
      };
      const logger = createLogger(options);
      expect(logger._globals.application).toEqual({ name: 'test', host: 'blah', version: '1.2.3' });
    });

    it('creates target with specified targets', () => {
      const options = {
        logging: {
          targets: [
            { name: 'console', formatter: { name: 'json', options: { dateFormat: 'YYYY-MM-DDTHH:mm:ss.SSS' } } },
            { name: 'file', options: { file: './temp.txt' } },
          ],
        },
      };
      const logger = createLogger(options);
      expect(logger._targets.length).toEqual(2);
    });
  });

  describe('.getLogger', () => {
    it('returns null', () => {
      expect(getLogger()).toBeNull();
    });

    it('returns current logger', () => {
      const logger = createLogger(DEFAULT_OPTIONS);
      setLogger(logger);
      expect(getLogger()).toEqual(logger);
    });
  });

  describe('.handleLogging', () => {
    const req = { url: '/test', method: 'GET', headers: { 'x-test': 'abc' }, ignored: 'ignored' };
    const res = {};

    it('logs request', async () => {
      const logger = createLogger(DEFAULT_OPTIONS);
      logger.info = jest.fn();
      setLogger(logger);
      await handleLogging(() => {})(req, res);

      expect(logger.info).toHaveBeenCalledWith('Incoming request', {
        req: { url: req.url, method: req.method, headers: req.headers },
      });
    });

    it('calls handler when no logger', async () => {
      const handler = jest.fn();
      await handleLogging(handler)(req, res);

      expect(handler).toHaveBeenCalledWith(req, res);
    });

    it('calls handler when logger', async () => {
      const handler = jest.fn();
      const logger = createLogger(DEFAULT_OPTIONS);
      logger.info = jest.fn();
      setLogger(logger);
      await handleLogging(handler)(req, res);

      expect(handler).toHaveBeenCalledWith(req, res);
    });
  });
});
