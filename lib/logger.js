const log = require('bristol');
const { getId } = require('micro-correlation-id');

log.addTarget('console').withFormatter('json', { dateFormat: 'YYYY-MM-DDTHH:mm:ss.SSS' });
log.setGlobal('correlationId', () => getId());

const handleLogging = handler => async (req, res) => {
  log.info('Incoming request', { req: { url: req.url, method: req.method, headers: req.headers } });
  return handler(req, res);
};

module.exports = {
  handleLogging,
  log,
};
