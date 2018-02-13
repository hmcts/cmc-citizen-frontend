# CMC Frontend

[![Greenkeeper badge](https://badges.greenkeeper.io/hmcts/cmc-citizen-frontend.svg)](https://greenkeeper.io/)

[![Standard - JavaScript Style Guide](https://img.shields.io/badge/code%20style-standard-brightgreen.svg)](http://standardjs.com/)

[![codecov](https://codecov.io/gh/hmcts/cmc-citizen-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/hmcts/cmc-citizen-frontend)

This is the frontend application for CMC. Service provides web UI for citizens, presented as sequence of HTML 5 web pages designed to GDS Service Design guidelines, so that they can make money claims and / or perform associated actions e.g submitting defence or requesting default judgement.

Service delegates most of the non UI responsibilities to underlying services e.g. claim-store or pdf-service.  

## Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) >= v8.0.0
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

See the README.md in cmc/integration-tests (not yet open sourced)

## Developing

### Code style

We use [TSLint](https://palantir.github.io/tslint/) with [StandardJS](http://standardjs.com/index.html) rules alongside [sass-lint](https://github.com/sasstools/sass-lint)

Running the linting:
`yarn lint`

### Running the tests

Mocha is used for writing tests.

Run them with:

```bash
$ yarn test
```

For functional testing:

```bash
$ yarn test:routes
```

For accessibility testing:

```bash
$ yarn test:a11y
```

For test coverage:

```bash
$ yarn test:coverage
```

For unit test coverage only:

```bash
$ yarn test:coverage-unit
```

## Troubleshooting

### Warnings while running ```yarn install``` on yarn version 1.0.1

There is currently an open issue : https://github.com/yarnpkg/yarn/issues/3751

Example:

```
warning The case-insensitive file ..\cmc-citizen-frontend\node_modules\nyc\node_modules shouldn't be copied twice in one bulk copy
warning The case-insensitive file ..\cmc-citizen-frontend\node_modules\nyc\node_modules\ansi-regex shouldn't be copied twice in one bulk copy
```

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE.txt) file for details
