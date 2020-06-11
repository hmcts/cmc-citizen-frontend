"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const apiLogger_1 = require("logging/apiLogger");
const httpProxyCallInterceptor_1 = require("logging/httpProxyCallInterceptor");
class RequestLoggingHandler {
    constructor(request, apiLogger = new apiLogger_1.ApiLogger()) {
        this.request = request;
        this.apiLogger = apiLogger;
        if (!this.request) {
            throw new Error('Initialised request instance is required');
        }
    }
    static proxy(request) {
        return new Proxy(request, new RequestLoggingHandler(request));
    }
    get(target, key) {
        return httpProxyCallInterceptor_1.HttpProxyCallInterceptor.intercept(target, key, (callTarget, methodName, methodArgs) => {
            this.handleLogging(methodName.toUpperCase(), asOptions(methodArgs[0]));
        });
    }
    handleLogging(method, options) {
        this.apiLogger.logRequest({
            method: method,
            uri: options.uri,
            requestBody: options.body,
            query: options.qs,
            headers: options.headers
        });
        let originalCallback = intercept(options.callback);
        options.callback = (err, response, body) => {
            originalCallback(err, response, body);
            this.apiLogger.logResponse({
                uri: options.uri,
                responseCode: ((response) ? response.statusCode : undefined),
                responseBody: body,
                error: err,
                requestHeaders: options.headers
            });
        };
    }
}
exports.RequestLoggingHandler = RequestLoggingHandler;
/**
 * Request provides a convenience method which accepts an URI string and builds the options
 * object behind the scenes. We need the options object upfront to set the logging callback on it.
 */
function asOptions(param) {
    if (typeof param === 'string' || param instanceof String) {
        return {
            uri: param
        };
    }
    else {
        return param;
    }
}
function intercept(callbackFunction) {
    return (err, response, body) => {
        if (callbackFunction) {
            callbackFunction(err, response, body);
        }
    };
}
