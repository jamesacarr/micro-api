const { methodName } = require('./method');

describe('method', () => {
  describe('.methodName', () => {
    it('returns lowercase name', () => {
      expect(methodName('ABC')).toEqual('abc');
    });

    it('returns del for DELETE', () => {
      expect(methodName('DELETE')).toEqual('del');
    });
  });
});
