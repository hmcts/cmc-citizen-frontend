"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const HttpStatus = require("http-status-codes");
const nodejs_logging_1 = require("@hmcts/nodejs-logging");
class ErrorLogger {
    constructor(logger = nodejs_logging_1.Logger.getLogger('errorLogger.js')) {
        this.logger = logger;
        this.logger = logger;
    }
    log(err) {
        if (err) {
            const logMessage = `${err.stack || err}`;
            if (err.statusCode && err.statusCode === HttpStatus.NOT_FOUND) {
                this.logger.debug(logMessage);
            }
            else {
                this.logger.error(logMessage);
            }
        }
        else {
            this.logger.debug('Received error was blank');
        }
    }
}
exports.ErrorLogger = ErrorLogger;
