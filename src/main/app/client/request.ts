import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { RequestTracingHandler } from 'logging/requestTracingHandler'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'

const timeout: number = config.get<number>('http.timeout')

export type RequestPromiseAPI = requestBase.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, requestBase.RequiredUriUrl>
export type DefaultRequestAPI = requestBase.RequestAPI<requestBase.Request, requestBase.CoreOptions, requestBase.RequiredUriUrl>
export type RequestAPI = RequestPromiseAPI | DefaultRequestAPI

const rpWithDefaultsSet = requestPromise
  .defaults({
    json: true,
    timeout: timeout
  })

const request: RequestPromiseAPI = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(rpWithDefaultsSet)
)
const requestNonPromise: DefaultRequestAPI = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(requestBase)
)

export {
  request,
  requestNonPromise
}
