const Boom = require('boom');
const { send } = require('micro');
const { createError, handleErrors } = require('./error');

jest.mock('micro');

describe('error', () => {
  describe('.createError', () => {
    it('creates a Boom error', () => {
      expect(createError(400, 'Testing')).toBeInstanceOf(Boom);
    });

    it('sets message', () => {
      const error = createError(400, 'testing');
      expect(error.message).toEqual('testing');
    });

    it('sets statusCode', () => {
      const error = createError(400, 'testing');
      expect(error.output.statusCode).toEqual(400);
    });

    it('sets data', () => {
      const data = { some: 'data' };
      const error = createError(400, 'testing', data);

      expect(error.data).toEqual(data);
    });
  });

  describe('.handleErrors', () => {
    it('does nothing when no error', () => {
      handleErrors(() => {})();
      expect(send).not.toHaveBeenCalled();
    });

    it('calls send with status code and payload', () => {
      const req = { a: 'a' };
      const res = { b: 'b' };
      const expectedPayload = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Testing',
      };

      handleErrors(() => {
        throw createError(400, 'Testing');
      })(req, res);

      expect(send).toHaveBeenCalledWith(res, 400, expectedPayload);
    });

    it('adds data to payload if specified', () => {
      const req = { a: 'a' };
      const res = { b: 'b' };
      const data = { some: 'data' };
      const expectedPayload = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Testing',
        data,
      };

      handleErrors(() => {
        throw createError(400, 'Testing', data);
      })(req, res);

      expect(send).toHaveBeenCalledWith(res, 400, expectedPayload);
    });

    it('handles standard errors', () => {
      const req = { a: 'a' };
      const res = { b: 'b' };
      const expectedPayload = {
        statusCode: 500,
        error: 'Internal Server Error',
        message: 'An internal server error occurred',
      };

      handleErrors(() => {
        throw new Error('Testing');
      })(req, res);

      expect(send).toHaveBeenCalledWith(res, 500, expectedPayload);
    });

    it('handles errors with statusCode set', () => {
      const req = { a: 'a' };
      const res = { b: 'b' };
      const expectedPayload = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Testing',
      };

      handleErrors(() => {
        const error = new Error('Testing');
        error.statusCode = 400;
        throw error;
      })(req, res);

      expect(send).toHaveBeenCalledWith(res, 400, expectedPayload);
    });

    it('handles errors with status set', () => {
      const req = { a: 'a' };
      const res = { b: 'b' };
      const expectedPayload = {
        statusCode: 400,
        error: 'Bad Request',
        message: 'Testing',
      };

      handleErrors(() => {
        const error = new Error('Testing');
        error.status = 400;
        throw error;
      })(req, res);

      expect(send).toHaveBeenCalledWith(res, 400, expectedPayload);
    });
  });
});
