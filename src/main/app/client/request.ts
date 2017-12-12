import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { RequestTracingHandler } from 'logging/requestTracingHandler'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'

const timeout: number = config.get<number>('http.timeout')

const wrappedRequestPromise = requestPromise
  .defaults({
    json: true,
    timeout: timeout
  })

const requestPromiseWithLogging = new Proxy(wrappedRequestPromise, new RequestLoggingHandler(wrappedRequestPromise))
const requestBaseWithLogging = new Proxy(requestBase, new RequestLoggingHandler(requestBase))

const request = new Proxy(requestPromiseWithLogging, new RequestTracingHandler(wrappedRequestPromise))
const requestNonPromise = new Proxy(requestBaseWithLogging, new RequestTracingHandler(requestBase))

export { request, requestNonPromise }
