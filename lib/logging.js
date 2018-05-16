const bristol = require('bristol');
const { getId } = require('micro-correlation-id');

let globalLogger;

const addApplicationData = (logger, application) => {
  if (!application) return;

  const { name, host, version } = application;
  logger.setGlobal('application', { name, host, version });
};

const addLoggerTargets = (logger, logging) => {
  if (!logging || !logging.targets) return;

  logging.targets.forEach(({ name, options, formatter }) => {
    const target = logger.addTarget(name, options);
    if (formatter) {
      target.withFormatter(formatter.name, formatter.options);
    }
  });
};

const createLogger = options => {
  const logger = new bristol.Bristol();
  logger.setGlobal('correlationId', () => getId());

  if (options) {
    const { application, logging } = options;
    addApplicationData(logger, application);
    addLoggerTargets(logger, logging);
  }

  return logger;
};

const getLogger = () => globalLogger;

const setLogger = logger => {
  globalLogger = logger;
};

const handleLogging = handler => async (req, res) => {
  if (globalLogger) {
    globalLogger.info('Incoming request', { req: { url: req.url, method: req.method, headers: req.headers } });
  }
  return handler(req, res);
};

module.exports = {
  createLogger,
  getLogger,
  setLogger,
  handleLogging,
};
