import { Logger, LoggingConfig, RequestTracingHeaders as Headers } from '@hmcts/nodejs-logging'

export class ApiLogger {
  constructor (public logger = Logger.getLogger('apiLogger.js'), public loggingConfig = LoggingConfig.logging) {
    this.logger = logger
    this.loggingConfig = loggingConfig
  }

  logRequest (requestData) {
    return this.logger.info(this._buildRequestEntry(requestData))
  }

  _buildRequestEntry (requestData) {
    const logEntry = {
      message: `API: ${requestData.method} ${requestData.uri} ` +
      ((requestData.query) ? `| Query: ${this._stringifyObject(requestData.query)} ` : '') +
      ((requestData.requestBody) ? `| Body: ${this._stringifyObject(requestData.requestBody)} ` : '')
    }
    return {
      ...logEntry,
      ...this.tracingInformation(requestData.headers)
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
      responseCode: responseData.responseCode
    }
    return {
      ...logMessage,
      ...this.tracingInformation(responseData.requestHeaders)
    }
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

  private tracingInformation (headers) {
    const fields = { }
    if (headers) {
      fields['requestId'] = headers[Headers.REQUEST_ID_HEADER]
      fields['rootRequestId'] = headers[Headers.ROOT_REQUEST_ID_HEADER]
      fields['originRequestId'] = headers[Headers.ORIGIN_REQUEST_ID_HEADER]
    }
    return fields
  }
}
