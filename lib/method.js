const { parse } = require('url');
const UrlPattern = require('url-pattern');

const patternOpts = {
  segmentNameCharset: 'a-zA-Z0-9_-',
  segmentValueCharset: 'a-zA-Z0-9@.+-_',
};

const methodName = method => (method === 'DELETE' ? 'del' : method.toLowerCase());

const createMethodFn = (method, router) => (givenPath, handler) => {
  if (!givenPath) throw new Error('You need to set a valid path');
  if (!handler) throw new Error('You need to set a valid handler');

  const path = givenPath === '/' ? '(/)' : givenPath;
  const pattern = new UrlPattern(path, patternOpts);

  router.routes.push({
    pattern,
    method,
    handler: (req, res) => {
      const { query, pathname } = parse(req.url, true);
      const params = pattern.match(pathname);
      return handler(Object.assign(req, { params, query }), res);
    },
  });

  return router;
};

module.exports = {
  createMethodFn,
  methodName,
};
