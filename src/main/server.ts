#!/usr/bin/env node

import * as tsConfigPaths from 'tsconfig-paths'
import { cpus } from 'os'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as cluster from 'cluster'

const tsConfig = require('../../tsconfig.json')
const numberOfCores = cpus().length
const port: number = parseInt(process.env.PORT, 10) || 3000
const logger = require('@hmcts/nodejs-logging').getLogger('server')

function bootstrapTypeScriptPaths (tsConfig: any) {
  tsConfigPaths.register({
    baseUrl: tsConfig.compilerOptions.baseUrl,
    paths: tsConfig.compilerOptions.paths
  })
}

function listen (app: express.Application, port: number) {
  if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
    const server = https.createServer(getSSLOptions(), app)
    server.listen(port, () => {
      logger.info(`Listener started: https://localhost:${port}`)
    })
  } else {
    app.listen(port, () => {
      logger.info(`Listener started: http://localhost:${port}`)
    })
  }
}

function getSSLOptions (): any {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
  return {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  }
}

function forkListenerProcesses (numberOfCores: number) {
  for (let i = 0; i < numberOfCores; i++) {
    cluster.fork()
  }
  cluster.on('online', (worker) => {
    logger.info(`Worker ${worker.process.pid} is online`)
  })
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`)
  })
}

bootstrapTypeScriptPaths(tsConfig)

import { app } from './app'

if (cluster.isMaster) {
  forkListenerProcesses(numberOfCores)
} else {
  listen(app, port)
}
