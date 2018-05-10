# Micro API Router

[![CircleCI](https://img.shields.io/circleci/project/github/jamesacarr/micro-api-router.svg)](https://circleci.com/gh/jamesacarr/micro-api-router)
[![XO code style](https://img.shields.io/badge/code_style-XO-5ed9c7.svg)](https://github.com/sindresorhus/xo)
[![Prettier code style](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Summary

Micro API Router helps to standardise API microservices. It's middleware for ZEIT's [Micro](https://github.com/zeit/micro) and provides a level of base functionality out of the box such as:

- CORS headers
- Correlation ID header (`X-Correlation-ID`)
- Health Check endpoint (`/health`)
- JSON error handling

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
const handler = () => 'ok!'

module.exports = createRouter().get('/', handler)
```

### With options

```js
const { createRouter } = require('micro-api-router')
const router = createRouter({ application: { name: 'Micro API' } })
const handler = () => 'ok!'

module.exports = router.get('/', handler)
```

### Error Handling

```js
const { createRouter, createError } = require('micro-api-router')
const error = () => throw createError(500, 'Internal Server Error')
const errorWithData = () => throw createError(500, 'Internal Server Error', { some: 'data' })

module.exports = createRouter()
  .get('/error', error)
  .get('/errorWithData', errorWithData)
```

### Options

#### `application`

Application-specific properties. All properties under `application` will be returned as JSON via the `/health` endpoint.

##### `application.name`

default: `process.env.API_NAME` or `Unknown` if not set

Name of the microservice

##### `application.description`

default: `process.env.API_DESCRIPTION` or empty string if not set

Short description of the microservice

##### `application.host`

default: `process.env.API_HOST` or `unknown` if not set

Host url/name of the microservice

##### `application.dependecies`

default: `[]`

Array of external dependencies that the microservice relies on

##### `application.version`

default: `process.env.API_VERSION` or `N/A` if not set

Version of the microservice

#### `cors`

##### `cors.allowMethods`

default: `['POST','GET','PUT','DELETE','OPTIONS']`

##### `cors.allowHeaders`

default: `['X-Requested-With','Access-Control-Allow-Origin','X-HTTP-Method-Override','Content-Type','Authorization','Accept']`

##### `cors.exposeHeaders`

default: `[]`

##### `cors.maxAge`

default: `86400`

##### `cors.origin`

default: `*`

## Contributing

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies with `yarn install`
3. Create a [pull request](https://help.github.com/articles/about-pull-requests/) with your changes when ready

You can run the [Jest](https://github.com/facebook/jest) test by using `yarn test` and the [XO](https://github.com/sindresorhus/xo) metrics by using: `yarn metrics`

## License

MIT © James Carr
