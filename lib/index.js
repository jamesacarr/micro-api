const { getId } = require('micro-correlation-id');
const { createError } = require('./error');
const { createLogger, getLogger, setLogger } = require('./logging');
const createRouter = require('./router');

module.exports = {
  createError,
  createRouter,
  getId,
  createLogger,
  getLogger,
  setLogger,
};
