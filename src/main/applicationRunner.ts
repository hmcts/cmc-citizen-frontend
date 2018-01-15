import * as express from 'express'
import * as fs from 'fs'
import * as path from 'path'
import * as https from 'https'
import { Logger } from '@hmcts/nodejs-logging'

const logger = Logger.getLogger('applicationRunner')

export class ApplicationRunner {
  static run (app: express.Application): void {
    const port = ApplicationRunner.applicationPort()
    if (app.locals.ENV === 'development' || app.locals.ENV === 'dockertests') {
      const server = https.createServer(ApplicationRunner.getSSLOptions(), app)
      server.listen(port, () => {
        logger.info(`Listener started (PID ${process.pid}): https://localhost:${port}`)
      })
    } else {
      app.listen(port, () => {
        logger.info(`Listener started (PID ${process.pid}): http://localhost:${port}`)
      })
    }
  }

  private static getSSLOptions (): any {
    const sslDirectory = path.join(__dirname, 'resources', 'localhost-ssl')
    return {
      key: fs.readFileSync(path.join(sslDirectory, 'localhost.key')),
      cert: fs.readFileSync(path.join(sslDirectory, 'localhost.crt'))
    }
  }

  /**
   * Return type is string because Azure PaaS communicates with the application
   * through a named pipe and not a TCP port.
   */
  private static applicationPort (): string {
    const defaultPort = '3000'
    let port: string = process.env.PORT
    if (port === undefined) {
      logger.info(`Port value was not set using PORT env variable, using the default of ${defaultPort}`)
      port = defaultPort
    }
    return port
  }
}
