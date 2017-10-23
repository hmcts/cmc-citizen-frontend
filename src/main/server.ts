#!/usr/bin/env node

import { app } from './app'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const port: number = parseInt(process.env.PORT, 10) || 3000

const logger = require('@hmcts/nodejs-logging').getLogger('server')

if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
  const sslOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  }
  const server = https.createServer(sslOptions, app)
  server.listen(port, () => {
    logger.info(`Application started: https://localhost:${port}`)
  })
} else {
  app.listen(port, () => {
    logger.log(`Application started: http://localhost:${port}`)
  })
}
