const host = require('os').hostname();

module.exports = {
  application: {
    name: process.env.API_NAME || 'Unknown',
    description: process.env.API_DESCRIPTION || '',
    host: process.env.API_HOST || host,
    dependencies: [],
    version: process.env.API_VERSION || 'development',
  },
  cors: {
    allowMethods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowHeaders: [
      'Accept',
      'Authorization',
      'Access-Control-Allow-Origin',
      'Content-Type',
      'X-Correlation-ID',
      'X-HTTP-Method-Override',
      'X-Requested-With',
    ],
    exposeHeaders: [],
    maxAge: 86400,
    origin: '*',
  },
  logging: {
    targets: [{ name: 'console', formatter: { name: 'json', options: { dateFormat: 'YYYY-MM-DDTHH:mm:ss.SSS' } } }],
  },
};
