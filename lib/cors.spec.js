const { handleCors } = require('./cors');

describe('cors', () => {
  describe('.handleCors', () => {
    let req;
    let res;
    const options = {
      allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowHeaders: [
        'Accept',
        'Authorization',
        'Access-Control-Allow-Origin',
        'Content-Type',
        'X-Correlation-ID',
        'X-HTTP-Method-Override',
        'X-Requested-With',
      ],
      exposeHeaders: [],
      maxAge: 86400,
      origin: '*',
    };

    beforeEach(() => {
      req = { correlationId: () => '123' };
      res = { setHeader: jest.fn() };
    });

    it('sets X-Correlation-ID', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('X-Correlation-ID', '123');
    });

    it('sets Access-Control-Max-Age', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Max-Age', '86400');
    });

    it('sets Access-Control-Allow-Credentials', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Credentials', 'true');
    });

    it('sets Access-Control-Allow-Headers', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith(
        'Access-Control-Allow-Headers',
        'Accept,Authorization,Access-Control-Allow-Origin,Content-Type,X-Correlation-ID,X-HTTP-Method-Override,X-Requested-With'
      );
    });

    it('sets Access-Control-Allow-Methods', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,OPTIONS');
    });

    it('sets Access-Control-Allow-Origin', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Allow-Origin', '*');
    });

    it('does not set Access-Control-Expose-Headers when not supplied', async () => {
      await handleCors(options)(() => {})(req, res);
      expect(res.setHeader).not.toHaveBeenCalledWith('Access-Control-Expose-Headers', expect.anything);
    });

    it('sets Access-Control-Expose-Headers when supplied', async () => {
      await handleCors({ ...options, exposeHeaders: ['abc', 'def'] })(() => {})(req, res);
      expect(res.setHeader).toHaveBeenCalledWith('Access-Control-Expose-Headers', 'abc,def');
    });

    it('calls handler', async () => {
      const handler = jest.fn();
      await handleCors(options)(handler)(req, res);
      expect(handler).toHaveBeenCalledWith(req, res);
    });
  });
});
