import { Logger, LoggingConfig } from '@hmcts/nodejs-logging'

export class ApiLogger {
  constructor (public logger = Logger.getLogger('apiLogger.js'), public loggingConfig = LoggingConfig.logging) {
    this.logger = logger
    this.loggingConfig = loggingConfig
  }

  logRequest (requestData) {
    return this.logger.info(this._buildRequestEntry(requestData))
  }

  _buildRequestEntry (requestData) {
    return {
      message: `API: ${requestData.method} ${requestData.uri} ` +
      ((requestData.query) ? `| Query: ${this._stringifyObject(requestData.query)} ` : '') +
      ((requestData.requestBody) ? `| Body: ${this._stringifyObject(requestData.requestBody)} ` : ''),
      requestId: requestData.headers['Request-Id'],
      rootRequestId: requestData.headers['Root-Request-Id'],
      originRequestId: requestData.headers['Origin-Request-Id']
    }
  }

  logResponse (responseData) {
    this._logLevelFor(responseData.responseCode).call(this.logger, this._buildResponseEntry(responseData))
  }

  _buildResponseEntry (responseData) {
    const logMessage = {
      message: `API: Response ${responseData.responseCode} from ${responseData.uri} ` +
      ((responseData.responseBody && this.isDebugLevel()) ? `| Body: ${this._stringifyObject(responseData.responseBody)} ` : '') +
      ((responseData.error) ? `| Error: ${this._stringifyObject(responseData.error)} ` : ''),
      responseCode: responseData.responseCode,
      requestId: responseData.requestHeaders['Request-Id'],
      rootRequestId: responseData.requestHeaders['Root-Request-Id'],
      originRequestId: responseData.requestHeaders['Origin-Request-Id']
    }
    return logMessage
  }

  _stringifyObject (object) {
    if (object !== null && typeof object === 'object') {
      return JSON.stringify(object)
    }

    if (typeof object === 'string' && object.startsWith('%PDF')) {
      return '**** PDF Content not shown****'
    }

    return object
  }

  _logLevelFor (statusCode) {
    if (statusCode < 400 || statusCode === 404) {
      return this.logger.info
    } else if (statusCode >= 400 && statusCode < 500) {
      return this.logger.warn
    } else {
      return this.logger.error
    }
  }

  private isDebugLevel (): boolean {
    return this.resolveLoggingLevel() === 'DEBUG' || this.resolveLoggingLevel() === 'TRACE' || this.resolveLoggingLevel() === 'ALL'
  }

  private resolveLoggingLevel () {
    const currentLevel = process.env.LOG_LEVEL || 'INFO'
    return currentLevel.toUpperCase()
  }
}
