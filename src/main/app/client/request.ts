import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { RequestTracingHandler } from 'logging/requestTracingHandler'
import { ApiLogger } from 'logging/apiLogger'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'

const logger = new ApiLogger()

const timeout: number = config.get<number>('http.timeout')

const wrappedRequestPromise = requestPromise
  .defaults({
    json: true,
    timeout: timeout
  })

const requestPromiseWithLogging = new Proxy(wrappedRequestPromise, new RequestLoggingHandler(wrappedRequestPromise, logger))
const requestBaseWithLogging = new Proxy(requestBase, new RequestLoggingHandler(requestBase, logger))

const request = new Proxy(requestPromiseWithLogging, new RequestTracingHandler(wrappedRequestPromise))
const requestNonPromise = new Proxy(requestBaseWithLogging, new RequestTracingHandler(requestBase))

export { request, requestNonPromise }
