const deepMerge = require('deepmerge');
const { correlator } = require('micro-correlation-id');

const { createError, handleErrors } = require('./error');
const { createMethodFn, methodName } = require('./method');

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];
const DEFAULT_OPTIONS = {
  application: {
    name: process.env.API_NAME || 'Unknown',
    description: process.env.API_DESCRIPTION || '',
    host: process.env.API_HOST || 'unknown',
    dependencies: [],
    version: process.env.API_VERSION || 'N/A',
  },
  cors: {
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
  },
};

const findRoute = (routes, url, method) => routes.find(route => route.method === method && route.pattern.match(url));

const setHeaders = (req, res, cors) => {
  res.setHeader('X-Correlation-ID', req.correlationId());

  const { maxAge, origin, allowHeaders, exposeHeaders, allowMethods } = cors;
  res.setHeader('Access-Control-Max-Age', String(maxAge));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
  res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (exposeHeaders && exposeHeaders.length > 0) {
    res.setHeader('Access-Control-Expose-Headers', exposeHeaders.join(','));
  }
};

const createRouter = (options = {}) => {
  options = deepMerge(DEFAULT_OPTIONS, options, { arrayMerge: (dest, source) => source });

  const router = correlator()(
    handleErrors(async (req, res) => {
      setHeaders(req, res, options.cors);
      const route = findRoute(router.routes, req.url, req.method);

      if (!route) {
        throw createError(404, 'URL does not exist');
      }

      return route.handler(req, res);
    })
  );

  // Create action methods on router
  METHODS.forEach(method => {
    router[methodName(method)] = createMethodFn(method, router);
  });

  // Default routes
  router.routes = [];
  router.options('/*', () => null);
  router.get('/health', () => ({ ...options.application }));

  return router;
};

module.exports = createRouter;
