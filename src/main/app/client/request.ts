import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { RequestTracingHandler } from 'logging/requestTracingHandler'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'

const timeout: number = config.get<number>('http.timeout')

const rpWithDefaultsSet = requestPromise
  .defaults({
    json: true,
    timeout: timeout
  })

const request = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(rpWithDefaultsSet)
)
const requestNonPromise = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(requestBase)
)

export {
  request,
  requestNonPromise
}
