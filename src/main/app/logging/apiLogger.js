"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
class ApiLogger {
    constructor(logger = nodejs_logging_1.Logger.getLogger('apiLogger.js')) {
        this.logger = logger;
        this.logger = logger;
    }
    logRequest(requestData) {
        this.logger.info(this._buildRequestEntry(requestData));
    }
    _buildRequestEntry(requestData) {
        return `API: ${requestData.method} ${requestData.uri} ` +
            ((requestData.query) ? `| Query: ${this._stringifyObject(requestData.query)} ` : '') +
            ((requestData.requestBody) ? `| Body: ${this._stringifyObject(requestData.requestBody)} ` : '');
    }
    logResponse(responseData) {
        this._logLevelFor(responseData.responseCode).call(this.logger, this._buildResponseEntry(responseData));
    }
    _buildResponseEntry(responseData) {
        return `API: Response ${responseData.responseCode} from ${responseData.uri} ` +
            ((responseData.responseBody && this.isDebugLevel()) ? `| Body: ${this._stringifyObject(responseData.responseBody)} ` : '') +
            ((responseData.error) ? `| Error: ${this._stringifyObject(responseData.error)} ` : '');
    }
    _stringifyObject(object) {
        if (object !== null && typeof object === 'object') {
            return JSON.stringify(object);
        }
        if (typeof object === 'string' && object.startsWith('%PDF')) {
            return '**** PDF Content not shown****';
        }
        return object;
    }
    _logLevelFor(statusCode) {
        if (statusCode < 400 || statusCode === 404) {
            return this.logger.info;
        }
        else if (statusCode >= 400 && statusCode < 500) {
            return this.logger.warn;
        }
        else {
            return this.logger.error;
        }
    }
    isDebugLevel() {
        return this.resolveLoggingLevel() === 'DEBUG' || this.resolveLoggingLevel() === 'SILLY';
    }
    resolveLoggingLevel() {
        const currentLevel = process.env.LOG_LEVEL || 'INFO';
        return currentLevel.toUpperCase();
    }
}
exports.ApiLogger = ApiLogger;
