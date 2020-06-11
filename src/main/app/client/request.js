"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const requestPromiseLoggingHandler_1 = require("logging/requestPromiseLoggingHandler");
const config = require("config");
const requestRetry = require("@hmcts/requestretry");
const timeout = config.get('http.timeout');
const maxAttempts = config.get('requestRetry.maxAttempts');
const defaultOptions = {
    json: true,
    timeout: timeout
};
const defaultRequestRetryOptions = {
    fullResponse: false,
    maxAttempts: maxAttempts
};
const retryingRequest = requestPromiseLoggingHandler_1.RequestLoggingHandler.proxy(requestRetry.defaults(Object.assign(Object.assign({}, defaultOptions), defaultRequestRetryOptions)));
exports.request = retryingRequest;
const noRetryRequestRetryOptions = {
    fullResponse: false,
    maxAttempts: 0
};
const noRetryRequest = requestPromiseLoggingHandler_1.RequestLoggingHandler.proxy(requestRetry.defaults(Object.assign(Object.assign({}, defaultOptions), noRetryRequestRetryOptions)));
exports.noRetryRequest = noRetryRequest;
