import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
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

const request = new Proxy(wrappedRequestPromise, new RequestLoggingHandler(wrappedRequestPromise, logger))
const requestNonPromise = new Proxy(requestBase, new RequestLoggingHandler(requestBase, logger))

export { request, requestNonPromise }
