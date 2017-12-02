#!/usr/bin/env node

import './ts-paths-bootstrap'
import * as config from 'config'
import * as toBoolean from 'to-boolean'
import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

import { app } from './app'
import { ApplicationCluster } from './applicationCluster'

const logger = require('@hmcts/nodejs-logging').getLogger('server')

const defaultPort = 3000

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

function applicationPort (): any {
  let port: any = process.env.PORT
  if (port === undefined) {
    logger.info(`Port value was not set using PORT env variable, using the default of ${defaultPort}`)
    port = defaultPort
  }
  return port
}

const entryPoint = () => listen(app, applicationPort())

if (toBoolean(config.get<boolean>('featureToggles.clusterMode'))) {
  ApplicationCluster.execute(entryPoint)
} else {
  entryPoint()
}
