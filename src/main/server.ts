#!/usr/bin/env node

import { app } from './app'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'

const port: number = process.env.PORT || 3000

if (app.locals.ENV === 'development') {
  const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
  const sslOptions = {
    key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
    cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
  }
  const server = https.createServer(sslOptions, app)
  server.listen(port, () => {
    console.log(`Application started: https://localhost:${port}`)
  })
} else {
  app.listen(port, () => {
    console.log(`Application started: http://localhost:${port}`)
  })
}
