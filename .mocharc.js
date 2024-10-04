'use strict';

module.exports = {
  require: [
    'ts-node/register',
    'tsconfig-paths/register'
  ],
  ignore: process.env.FEATURE_DISABLE_PAGES === 'true' ?
    [
      'src/test/features/claim/**/*.ts',
      'src/test/features/eligibility/**/*.ts',
      'src/test/features/dashboard/**/*.ts'
    ] : [],
  reporter: 'mochawesome'
};
