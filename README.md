# CMC Frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/cmc-citizen-frontend.svg)](https://greenkeeper.io/)

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![codecov](https://codecov.io/gh/hmcts/cmc-citizen-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/hmcts/cmc-citizen-frontend)

This is the frontend application for CMC. Service provides web UI for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can make money claims and / or perform associated actions e.g submitting defence or requesting default judgement.

Service delegates most of the non UI responsibilities to underlying services e.g. claim-store or pdf-service.  

## Getting Started 

### Prerequisites

* [Node.js](https://nodejs.org/) >= v10.15.2
* [yarn](https://yarnpkg.com/)
* [Gulp](http://gulpjs.com/)
* [Docker](https://www.docker.com)

### Running the application

Install dependencies by executing the following command:

 ```bash
$ yarn install
 ```

Run:

```bash
$ gulp
```

It will be available at https://localhost:3000

### Running the application on docker (integrated environment)

See the README.md in hmcts/cmc-integration-tests

## Developing 

### Code style

We use [TSLint](https://palantir.github.io/tslint/) with [StandardJS](http://standardjs.com/index.html) rules alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
`yarn lint`

### Running the tests

Mocha is used for writing tests.

Run them with:

```bash
$ yarn tests
```

For functional testing:

```bash
$ yarn test:routes
```

For accessibility testing:

```bash
$ yarn tests:a11y
```

For test coverage:

```bash
$ yarn tests:coverage
```

For unit test coverage only:

```bash
$ yarn test:coverage-unit
```

### Running end to end tests

Integration tests are written using [CodeceptJS](https://codecept.io/) framework and reside in [`src/integration-test`](src/integration-test) directory. They are executed using Docker.

If you want to run them to see if your changes work, you will need to build a docker image containing your updates:

```bash
$ docker-compose build citizen-integration-tests
```

Then you can go to the [integration-tests](https://github.com/hmcts/cmc-integration-tests) project and run them with:

```bash
$ ./bin/run-local-citizen-tests.sh
```

If you didn't have a dockerized environment running it will be started up for you. If you prefer to start it up yourself beforehand, do:

```bash
$ ./bin/start-local-environment.sh
```

For more details on the dockerized environment please refer to integration-tests repository's[`README`](https://github.com/hmcts/cmc-integration-tests/blob/master/README.md) file.

## Troubleshooting

### Warnings while running ```yarn install``` on yarn version 1.0.1

There is currently an open issue : https://github.com/yarnpkg/yarn/issues/3751

Example:

```
warning The case-insensitive file ..\cmc-citizen-frontend\node_modules\nyc\node_modules shouldn't be copied twice in one bulk copy
warning The case-insensitive file ..\cmc-citizen-frontend\node_modules\nyc\node_modules\ansi-regex shouldn't be copied twice in one bulk copy
```

## Preview Environment

We get a fully functional environment in Azure Kubernetes (AKS) per pull request. For more
info see: https://tools.hmcts.net/confluence/display/ROC/AKS+-+Azure+Managed+Kubernetes

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details
