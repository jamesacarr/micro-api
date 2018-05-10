const UrlPattern = require('url-pattern');
const { methodName, createMethodFn } = require('./method');

describe('method', () => {
  describe('.methodName', () => {
    it('returns lowercase name', () => {
      expect(methodName('ABC')).toEqual('abc');
    });

    it('returns del for DELETE', () => {
      expect(methodName('DELETE')).toEqual('del');
    });
  });

  describe('createMethodFn', () => {
    let router;
    let methodFn;

    beforeEach(() => {
      router = { routes: [] };
      methodFn = createMethodFn('GET', router);
    });

    it('throws error when no givenPath', () => {
      expect(methodFn).toThrow('You need to set a valid path');
    });

    it('throws error when no handler', () => {
      const wrapper = () => {
        methodFn('/path');
      };

      expect(wrapper).toThrow('You need to set a valid handler');
    });

    describe('valid params', () => {
      let handler;
      let route;

      beforeEach(() => {
        handler = jest.fn(() => 'abc');
        methodFn('/path/:id', handler);
        [route] = router.routes;
      });

      it('adds to routes', () => {
        expect(router.routes.length).toEqual(1);
      });

      it('sets route method', () => {
        expect(route.method).toEqual('GET');
      });

      it('sets route pattern', () => {
        expect(route.pattern).toBeInstanceOf(UrlPattern);
        expect(route.pattern.stringify({ id: '123' })).toEqual('/path/123');
      });

      it('sets route handler', () => {
        expect(route.handler).toBeInstanceOf(Function);
      });

      it('calls handler with params and query', () => {
        const req = { url: '/path/abc?q=123' };
        const res = {};
        route.handler(req, res);

        expect(handler).toHaveBeenCalledWith({ ...req, params: { id: 'abc' }, query: { q: '123' } }, res);
      });

      it('handler returns original fns value', () => {
        expect(route.handler({ url: 'path' }, {})).toEqual('abc');
      });
    });
  });
});
