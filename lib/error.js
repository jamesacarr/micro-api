const { send } = require('micro');
const Boom = require('boom');

const { NODE_ENV } = process.env;
const DEV = NODE_ENV === 'development';

const createError = (statusCode, message, data) => new Boom(message, { statusCode, data });

const handleErrors = fn => async (req, res) => {
  try {
    return await fn(req, res);
  } catch (err) {
    if (DEV) {
      console.error(err.stack);
    }

    const statusCode = err.isBoom ? err.output.statusCode : err.statusCode || err.status || 500;
    const error = err.isBoom ? err : Boom.boomify(err, { statusCode });
    if (error.data) {
      error.output.payload.data = error.data;
    }

    send(res, statusCode, error.output.payload);
  }
};

module.exports = {
  createError,
  handleErrors,
};
