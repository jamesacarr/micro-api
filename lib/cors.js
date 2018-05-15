const handleCors = options => handler => async (req, res) => {
  res.setHeader('X-Correlation-ID', req.correlationId());

  const { maxAge, origin, allowHeaders, exposeHeaders, allowMethods } = options;
  res.setHeader('Access-Control-Max-Age', String(maxAge));
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Headers', allowHeaders.join(','));
  res.setHeader('Access-Control-Allow-Methods', allowMethods.join(','));
  res.setHeader('Access-Control-Allow-Origin', origin);
  if (exposeHeaders && exposeHeaders.length > 0) {
    res.setHeader('Access-Control-Expose-Headers', exposeHeaders.join(','));
  }

  return handler(req, res);
};

module.exports = {
  handleCors,
};
