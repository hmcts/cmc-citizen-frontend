'use strict';

const http = require('node:http');

// Supertest closes local servers between tests; do not reuse their connections.
http.globalAgent = new http.Agent({ keepAlive: false });

module.exports = {
  // Keep TypeScript loading in ts-node rather than Node's native type stripper.
  'node-option': ['no-experimental-strip-types'],
  require: [
    'ts-node/register',
    'tsconfig-paths/register'
  ],
  reporter: 'mochawesome'
};
