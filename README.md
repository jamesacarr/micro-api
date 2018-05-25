# Micro API Router

[![CircleCI](https://img.shields.io/circleci/project/github/jamesacarr/micro-api-router.svg)](https://circleci.com/gh/jamesacarr/micro-api-router)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Renovate enabled](https://img.shields.io/badge/renovate-enabled-brightgreen.svg)](https://renovateapp.com/)
[![NPM badge](https://img.shields.io/npm/v/micro-api-router.svg)](https://www.npmjs.com/package/micro-api-router)

## Summary

Micro API Router helps to standardise API microservices. It's middleware for ZEIT's [Micro](https://github.com/zeit/micro) and provides a level of base functionality out of the box such as:

- CORS headers
- Correlation ID header (`X-Correlation-ID` provided by [micro-correlation-id](https://github.com/tafarij/micro-correlation-id))
- Health Check endpoint (`/health`)
- JSON error handling
- Request logging

## Installation

```sh
npm install --save micro-api-router
```

Or even better

```sh
yarn add micro-api-router
```

## Usage

### Basic

```js
const { createRouter } = require('micro-api-router')
const request = require('some-request-lib')
const handler = () => 'ok!'

// service.js
module.exports = createRouter().get('/', handler)

// test.js
const response = await request('/')
console.log(response) // 'ok!'
```

### API

#### `createRouter([options])`

Creates a new router. Adds a default `/health` endpoint which will return all information under `options.application`.
Returns an object with the following route methods (each method returns the router object to allow chaining):

- `get(path = String, handler = Function)`
- `post(path = String, handler = Function)`
- `put(path = String, handler = Function)`
- `patch(path = String, handler = Function)`
- `del(path = String, handler = Function)`
- `head(path = String, handler = Function)`
- `options(path = String, handler = Function)`

##### path

The URL pattern to define your path. Parameters are specified using `:` notation and they, along with query parameters, will be returned as part of the `req` object passed to `handler`.

For more information about defining paths, see [url-pattern](https://github.com/snd/url-pattern). This package is used to match paths.

##### handler

A simple function that will make some action based on your path. The format of this function is `(req, res) => {}`

###### `req.params`

As shown below, the parameters specified in the `path` will be present as part of the `req` parameter:

```js
const { createRouter } = require('micro-api-router')
const request = require('some-request-lib')

// service.js
module.exports = createRouter().get('/hello/:who', (req, res) => req.params)

// test.js
const response = await request('/hello/World')
console.log(response)  // { who: 'World' }
```

###### `req.query`

As shown below, the query parameters used in the request will also be present as part of the `req` parameter:

```js
const { createRouter } = require('micro-api-router')
const request = require('some-request-lib')

// service.js
module.exports = createRouter().get('/hello', (req, res) => req.query)

// test.js
const response = await request('/hello?who=World')
console.log(response)  // { who: 'World' }
```

##### Options

Defaults:

```js
const host = require('os').hostname();

{
  application: {                                       // Application-specific properties. Returned via `/health`
    name: process.env.API_NAME || 'Unknown',           // Name of the micro service
    description: process.env.API_DESCRIPTION || '',    // Desceription of the micro service
    host: process.env.API_HOST || host,                // Host url/name of the micro service
    dependencies: [],                                  // Dependencies that the micro service relies on
    version: process.env.API_VERSION || 'development', // Version of the micro service
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
    targets: [
      { name: 'console', formatter: { name: 'json', options: { dateFormat: 'YYYY-MM-DDTHH:mm:ss.SSS' } } },
    ],
  },
}
```

Example:

```js
const { createRouter } = require('micro-api-router')
const request = require('some-request-lib')

// service.js
module.exports = createRouter({ application: { name: 'Micro API' } })

// test.js
const response = await request('/health')
console.log(response) // { name: 'Micro API', description: '' host: 'unknown', dependencies: [], version: 'N/A' }
```

#### `createError(statusCode, message[, data])`

Creates a [Boom](https://github.com/hapijs/boom) Error instance with the supplied `statusCode`, `message` and `data`. Use with `throw` to return an error.

Returned errors include the request's correlation ID.

```js
const { createRouter, createError } = require('micro-api-router')
const request = require('some-request-lib')

const error = () => throw createError(500, 'Internal Server Error')
const errorWithData = () => throw createError(500, 'Internal Server Error', { some: 'data' })

// service.js
module.exports = createRouter()
  .get('/error', error)
  .get('/errorWithData', errorWithData)

// test.js
let response = await request('/error')
console.log(response) // { statusCode: 500, error: 'Internal Server Error', message: 'An internal server error occurred', correlationId: '123' }

response = await request('/errorWithData')
console.log(response) // { statusCode: 500, error: 'Internal Server Error', message: 'An internal server error occurred', correlationId: '123', data: { some: 'data' } }
```

#### `getId()`

Returns the correlation ID of the current request. Must be used inside a handler function.

The current correlation ID is either a generated UUIDv4 or the value passed in via the request's `x-correlation-id` header.

#### `createLogger([options])`

Creates a new logger. All loggers created via this method will automatically log the Correlation ID of requests.

If the `application` property is passed in via `options`, the logger will include the `name`, `host` and `version` properties in all logs.

If the `logging` property is passed in via `options`, the logger will use these properties to create targets and formatters. This property can be ignored to add targets & formatters manually.

For more information on customising the logging or adding new loggers, see: [Bristol](https://github.com/TomFrost/Bristol).

#### `getLogger()`

The current logger used by Micro API Router. By default, created based on `options.logging` passed into `createRouter`.

#### `setLogger(logger)`

Sets the global logger for Micro API Router. Can be any type of logger, as long as it has an `info` method (for logging request information).

## Contributing

Please see [CONTRIBUTING.md](./CONTRIBUTING.md)

## Inspired By

- [micro-boom](https://github.com/onbjerg/micro-boom)
- [micro-cors](https://github.com/possibilities/micro-cors)
- [micro-health](https://github.com/fmiras/micro-health)
- [micro-router](https://github.com/pedronauck/micro-router)

## License

MIT © James Carr
