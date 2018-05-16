# Contributing to Micro API Router

1. [Fork](https://help.github.com/articles/fork-a-repo/) this repository to your own GitHub account and then [clone](https://help.github.com/articles/cloning-a-repository/) it to your local device
2. Install the dependencies with `yarn install`
3. Run `yarn link` to link the local repo to Yarn (or `npm link` for NPM)
4. Then link this repo inside any local app with `yarn link micro-api-router` (or `npm link micro-api-router` for NPM)
5. Then you can run your local app with the local version of Micro API Router (You may need to re-run the local app as you change server side code in the Micro API Router repository)
6. Create a [pull request](https://help.github.com/articles/about-pull-requests/) with your changes when ready

You can run the [Jest](https://github.com/facebook/jest) tests by using `yarn test` and the [XO](https://github.com/sindresorhus/xo) metrics by using: `yarn metrics`
