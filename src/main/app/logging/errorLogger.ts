export class ErrorLogger {
  constructor (public logger = require('@hmcts/nodejs-logging').getLogger('errorLogger.js')) {
    this.logger = logger
  }

  log (err) {
    if (err) {
      this.logger.error(`${err.stack || err}`)
    } else {
      this.logger.debug('Received error was blank')
    }
  }
}
