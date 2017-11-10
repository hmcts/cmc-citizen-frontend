import * as tsConfigPaths from 'tsconfig-paths'

const tsConfig = require('../../tsconfig.json')

tsConfigPaths.register({
  baseUrl: tsConfig.compilerOptions.baseUrl,
  paths: tsConfig.compilerOptions.paths
})
