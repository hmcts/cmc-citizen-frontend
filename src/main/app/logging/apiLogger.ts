import { Logger } from '@hmcts/nodejs-logging'

export class ApiLogger {
  constructor (public logger = Logger.getLogger('apiLogger.js')) {
    this.logger = logger
  }

  logRequest (requestData): void {
    if (requestData.requestBody) {
      if (!requestData.requestBody.hasOwnProperty('oneTimePassword')) {
        this.logger.info(this._buildRequestEntry(requestData))
      }
    } else {
      this.logger.info(this._buildRequestEntry(requestData))
    }
  }

  _buildRequestEntry (requestData): string {
    return `API: ${requestData.method} ${requestData.uri} ` +
      ((requestData.query) ? `| Query: ${this._stringifyObject(requestData.query)} ` : '') +
      ((requestData.requestBody) ? `| Body: ${this._stringifyObject(requestData.requestBody)} ` : '')
  }

  logResponse (responseData): void {
    this._logLevelFor(responseData.responseCode).call(this.logger, this._buildResponseEntry(responseData))
  }

  _buildResponseEntry (responseData): string {
    return `API: Response ${responseData.responseCode} from ${responseData.uri} ` +
      ((responseData.responseBody && this.isDebugLevel()) ? `| Body: ${this._stringifyObject(responseData.responseBody)} ` : '') +
      ((responseData.error) ? `| Error: ${this._stringifyObject(responseData.error)} ` : '')
  }

  _stringifyObject (object): string {
    if (object !== null && typeof object === 'object') {
      return JSON.stringify(object)
    }

    if (typeof object === 'string' && object.startsWith('%PDF')) {
      return '**** PDF Content not shown****'
    }

    return object
  }

  _logLevelFor (statusCode): Function {
    if (statusCode < 400 || statusCode === 404) {
      return this.logger.info
    } else if (statusCode >= 400 && statusCode < 500) {
      return this.logger.warn
    } else {
      return this.logger.error
    }
  }

  private isDebugLevel (): boolean {
    return this.resolveLoggingLevel() === 'DEBUG' || this.resolveLoggingLevel() === 'SILLY'
  }

  private resolveLoggingLevel (): string {
    const currentLevel = process.env.LOG_LEVEL || 'INFO'
    return currentLevel.toUpperCase()
  }
}
