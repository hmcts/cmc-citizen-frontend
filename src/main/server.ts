#!/usr/bin/env node

import './ts-paths-bootstrap'
import { cpus } from 'os'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import * as cluster from 'cluster'

const logger = require('@hmcts/nodejs-logging').getLogger('server')

function listen (app: express.Application, port: number) {
  if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
    const server = https.createServer(getSSLOptions(), app)
    server.listen(port, () => {
      logger.info(`Listener started (PID ${process.pid}): https://localhost:${port}`)
    })
  } else {
    app.listen(port, () => {
      logger.info(`Listener started (PID ${process.pid}): http://localhost:${port}`)
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
  cluster.on('exit', (worker, code, signal) => {
    logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`)
  })
}

const testingSupportActivated = toBoolean(config.get<boolean>('featureToggles.testingSupport'))

if (cluster.isMaster) {
  if (testingSupportActivated) {
    logger.info('Testing support activated')
  }
  logger.info(`Master process running on ${process.pid}`)
  const numberOfCores = cpus().length
  forkListenerProcesses(numberOfCores)
} else {
  const app: express.Application = require('./app').app
  const port: number = parseInt(process.env.PORT, 10) || 3000
  listen(app, port)
}
