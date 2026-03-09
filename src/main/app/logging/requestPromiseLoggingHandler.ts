import { ApiLogger } from 'logging/apiLogger'
import { RequestAPI } from 'client/request'

export class RequestLoggingHandler {
  constructor (private request, private apiLogger = new ApiLogger()) {
    if (!this.request) {
      throw new Error('Initialised request instance is required')
    }
  }

  static proxy<T extends RequestAPI> (request: T): T {
    return new Proxy(request, new RequestLoggingHandler(request))
  }

  private static readonly HTTP_METHODS = new Set(['get', 'post', 'put', 'patch', 'del', 'delete', 'head'])

  get (target, key) {
    const original = target[key]
    if (typeof original !== 'function') return original
    const keyStr = key.toString().toLowerCase()
    const shouldLog = RequestLoggingHandler.HTTP_METHODS.has(keyStr)
    return (...methodArgs: any[]) => {
      const options = asOptions(methodArgs[0] ?? {})
      if (shouldLog) {
        this.apiLogger.logRequest({
          method: key.toString().toUpperCase(),
          uri: options?.uri ?? options?.url,
          requestBody: options?.body,
          query: options?.qs,
          headers: options?.headers
        })
      }
      const result = original.apply(target, methodArgs)
      if (result && typeof result.then === 'function' && shouldLog) {
        return result
          .then((body: any) => {
            this.apiLogger.logResponse({
              uri: options?.uri ?? options?.url,
              responseCode: typeof body?.statusCode === 'number' ? body.statusCode : undefined,
              responseBody: body?.body ?? body,
              requestHeaders: options?.headers
            })
            return body
          })
          .catch((err: any) => {
            if (shouldLog) {
              this.apiLogger.logResponse({
              uri: options?.uri ?? options?.url,
              responseCode: err?.statusCode ?? err?.response?.status,
              responseBody: err?.body ?? err?.response?.data,
              error: err,
              requestHeaders: options?.headers
              })
            }
            throw err
          })
      }
      return result
    }
  }
}

/**
 * Request provides a convenience method which accepts an URI string and builds the options
 * object behind the scenes. We need the options object upfront for logging.
 */
function asOptions (param) {
  if (typeof param === 'string' || param instanceof String) {
    return { uri: param }
  }
  return param ?? {}
}
