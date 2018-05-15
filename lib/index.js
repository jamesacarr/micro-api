const { getId } = require('micro-correlation-id');
const { createError } = require('./error');
const { log } = require('./logger');
const createRouter = require('./router');

module.exports = {
  createError,
  createRouter,
  getId,
  log,
};
