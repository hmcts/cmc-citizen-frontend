import * as HttpStatus from 'http-status-codes'
import { Logger } from '@hmcts/nodejs-logging'

export class ErrorLogger {
  constructor (public logger = Logger.getLogger('errorLogger.js')) {
    this.logger = logger
  }

  log (err) {
    if (err) {
      const logMessage = `${err.stack || err}`
      if (err.statusCode && err.statusCode === HttpStatus.NOT_FOUND) {
        this.logger.debug(logMessage)
      } else {
        this.logger.error(logMessage)
      }
    } else {
      this.logger.debug('Received error was blank')
    }
  }
}
