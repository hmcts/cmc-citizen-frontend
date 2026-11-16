'use strict';

module.exports = {
  // Keep TypeScript loading in ts-node rather than Node's native type stripper.
  'node-option': ['no-experimental-strip-types'],
  require: [
    './src/test/setup-http-agent.cjs',
    'ts-node/register',
    'tsconfig-paths/register'
  ],
  reporter: 'mochawesome'
};
