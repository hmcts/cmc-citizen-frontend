import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import * as config from 'config'
import * as requestBase from 'request'
import * as requestPromise from 'request-promise-native'
import * as requestRetry from '@hmcts/requestretry'

const timeout: number = config.get<number>('http.timeout')
const maxAttempts: number = config.get<number>('requestRetry.maxAttempts')

export type RequestPromiseAPI = requestBase.RequestAPI<requestPromise.RequestPromise, requestPromise.RequestPromiseOptions, any>
export type RequestAPI = RequestPromiseAPI

const defaultOptions = {
  json: true,
  timeout: timeout
}

const defaultRequestRetryOptions = {
  fullResponse: false,
  maxAttempts: maxAttempts
}

const retryingRequest: RequestPromiseAPI = RequestLoggingHandler.proxy(requestRetry.defaults({
  ...defaultOptions,
  ...defaultRequestRetryOptions
}))

const noRetryRequestRetryOptions = {
  fullResponse: false,
  maxAttempts: 0
}

const noRetryRequest: RequestPromiseAPI = RequestLoggingHandler.proxy(requestRetry.defaults({
  ...defaultOptions,
  ...noRetryRequestRetryOptions
}))

export {
  retryingRequest as request,
  noRetryRequest as noRetryRequest
}
