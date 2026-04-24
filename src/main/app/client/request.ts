import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { request as baseRequest, noRetryRequest as baseNoRetryRequest, RequestAPI } from 'client/httpClient'

export type { RequestAPI }

const retryingRequest: RequestAPI = RequestLoggingHandler.proxy(baseRequest)
const noRetryRequest: RequestAPI = RequestLoggingHandler.proxy(baseNoRetryRequest)

export {
  retryingRequest as request,
  noRetryRequest as noRetryRequest
}
