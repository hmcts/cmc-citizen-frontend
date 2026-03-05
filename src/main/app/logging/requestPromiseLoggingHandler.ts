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
      const options = asOptions(methodArgs[0])
      methodArgs[0] = options
      this.handleLogging(methodName.toUpperCase(), options)
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
 */
function asOptions (param) {
  if (typeof param === 'string' || param instanceof String) {
    return {
      uri: param
    }
  } else {
    return { ...param }
  }
}

