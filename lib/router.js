const deepMerge = require('deepmerge');
const compose = require('micro-compose');
const { correlator } = require('micro-correlation-id');

const { handleCors } = require('./cors');
const { createError, handleErrors } = require('./error');
const { createLogger, setLogger, handleLogging } = require('./logging');
const { createMethodFn, methodName } = require('./method');
const DEFAULT_OPTIONS = require('./options');

const METHODS = ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'HEAD', 'OPTIONS'];

const findRoute = (routes, url, method) => routes.find(route => route.method === method && route.pattern.match(url));

const createRouter = (options = {}) => {
  options = deepMerge(DEFAULT_OPTIONS, options, { arrayMerge: (dest, source) => source });
  setLogger(createLogger(options));

  const router = compose(correlator(), handleLogging, handleErrors, handleCors(options.cors))((req, res) => {
    const route = findRoute(router.routes, req.url, req.method);
    if (!route) throw createError(404, 'URL does not exist');

    return route.handler(req, res);
  });

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
