'use strict';

const http = require('node:http');

// Supertest starts and closes local servers between tests. Do not reuse sockets
// across those servers when Node enables global HTTP keep-alive by default.
http.globalAgent = new http.Agent({ keepAlive: false });

module.exports = {
  require: [
    'ts-node/register',
    'tsconfig-paths/register'
  ],
  reporter: 'mochawesome'
};
