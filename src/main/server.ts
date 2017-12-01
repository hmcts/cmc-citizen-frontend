#!/usr/bin/env node

import './ts-paths-bootstrap'
// import { cpus } from 'os'
// import * as config from 'config'
// import * as toBoolean from 'to-boolean'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
// import * as cluster from 'cluster'

const logger = require('@hmcts/nodejs-logging').getLogger('server')

const DEFAULT_PORT = 3000

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

function applicationPort (): number {
  let port: number = parseInt(process.env.PORT, 10)
  if (port === undefined || isNaN(port)) {
    logger.info(`Port value was not set using PORT env variable, using the default of ${DEFAULT_PORT}`)
    port = DEFAULT_PORT
  }
  return port
}

// function forkListenerProcesses (numberOfCores: number) {
//   for (let i = 0; i < numberOfCores; i++) {
//     cluster.fork()
//   }
//   cluster.on('exit', (worker, code, signal) => {
//     logger.info(`Worker ${worker.process.pid} exited with ${code ? code : signal}`)
//   })
// }

// const testingSupportActivated = toBoolean(config.get<boolean>('featureToggles.testingSupport'))

// if (cluster.isMaster) {
//   if (testingSupportActivated) {
//     logger.info('Testing support activated')
//   }
//   logger.info(`Master process running on ${process.pid}`)
//   const numberOfCores = cpus().length
//   forkListenerProcesses(numberOfCores)
// } else {
const app: express.Application = require('./app').app
listen(app, applicationPort())
// }
