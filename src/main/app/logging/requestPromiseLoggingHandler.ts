import { ApiLogger } from 'logging/apiLogger'
import { HttpProxyCallInterceptor } from 'logging/httpProxyCallInterceptor'
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

  get (target, key) {
    if (key === 'defaults') {
      return (...args) => {
        return RequestLoggingHandler.proxy(target[key](...args))
      }
    }
    return HttpProxyCallInterceptor.intercept(target, key, (callTarget: Object, methodName: string, methodArgs: any[]) => {
      const options = asOptions(methodArgs[0], methodArgs[1])
      this.handleLogging(methodName.toUpperCase(), options)
      // Only modify the arguments if we were passed an options object OR we have extra options to merge.
      // If it's a simple URI string, we keep it as is to avoid breaking signatures.
      if (typeof methodArgs[0] === 'object' || (methodArgs.length > 1 && typeof methodArgs[1] === 'object')) {
        methodArgs[0] = options
        if (methodArgs.length > 1 && typeof methodArgs[1] === 'object') {
          methodArgs.splice(1, 1)
        }
      }
    })
  }

  handleLogging (method, options) {
    this.apiLogger.logRequest({
      method: method,
      uri: options.uri,
      requestBody: options.body,
      query: options.qs,
      headers: options.headers
    })
    let originalCallback = options.callback
    options.callback = (err, response, body) => {
      if (originalCallback) {
        originalCallback(err, response, body)
      }
      this.apiLogger.logResponse({
        uri: options.uri,
        responseCode: ((response) ? response.statusCode : undefined),
        responseBody: body,
        error: err,
        requestHeaders: options.headers
      })
    }
  }
}

/**
 * Request provides a convenience method which accepts an URI string and builds the options
 * object behind the scenes. We need the options object upfront to set the logging callback on it.
 *
 * It also handles the (uri, options) signature by merging them.
 */
function asOptions (param, extraOptions?) {
  let options
  if (typeof param === 'string' || param instanceof String) {
    options = {
      uri: param
    }
  } else {
    options = param // Match master: use original object
  }

  if (extraOptions && typeof extraOptions === 'object') {
    options = { ...options, ...extraOptions }
  }
  return options
}

