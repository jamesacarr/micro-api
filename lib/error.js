const { send } = require('micro');
const Boom = require('boom');

const { NODE_ENV } = process.env;
const DEV = NODE_ENV === 'development';

const createError = (statusCode, message, data) => new Boom(message, { statusCode, data });

const formattedError = (req, err) => {
  const statusCode = err.isBoom ? err.output.statusCode : err.statusCode || err.status || 500;
  const error = err.isBoom ? err : Boom.boomify(err, { statusCode });
  if (error.data) {
    error.output.payload.data = error.data;
  }

  return {
    ...error.output.payload,
    correlationId: req.correlationId(),
  };
};

const handleErrors = handler => async (req, res) => {
  try {
    return await handler(req, res);
  } catch (err) {
    if (DEV) {
      console.error(err.stack);
    }

    const output = formattedError(req, err);
    send(res, output.statusCode, output);
  }
};

module.exports = {
  createError,
  handleErrors,
};
