import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { RequestTracingHandler } from 'logging/requestTracingHandler'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'
import * as requestRetry from '@hmcts/requestretry'

const timeout: number = config.get<number>('http.timeout')
const maxAttempts: number = config.get<number>('requestRetry.maxAttempts')

export type RequestPromiseAPI = requestBase.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, requestBase.RequiredUriUrl>
export type DefaultRequestAPI = requestBase.RequestAPI<requestBase.Request, requestBase.CoreOptions, requestBase.RequiredUriUrl>
export type RequestAPI = RequestPromiseAPI | DefaultRequestAPI

const defaultOptions = {
  json: true,
  timeout: timeout
}

const defaultRequestRetryOptions = {
  fullResponse: false,
  maxAttempts: maxAttempts
}

const requestNonPromise: DefaultRequestAPI = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(requestBase)
)

const retryingRequest: RequestPromiseAPI = RequestTracingHandler.proxy(
  RequestLoggingHandler.proxy(requestRetry.defaults({
    ...defaultOptions,
    ...defaultRequestRetryOptions
  }))
)

export {
  retryingRequest as request,
  requestNonPromise
}
