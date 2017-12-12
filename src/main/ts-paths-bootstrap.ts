import * as tsConfigPaths from 'tsconfig-paths'

const tsConfig = require('../../tsconfig.json')

tsConfigPaths.register({
  baseUrl: process.env.TS_BASE_URL || tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths
})
