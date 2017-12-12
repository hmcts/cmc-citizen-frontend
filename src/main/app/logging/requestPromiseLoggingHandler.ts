import { ApiLogger } from 'logging/apiLogger'

const httpCallMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head']

export class RequestLoggingHandler {
  constructor (private request, private apiLogger = new ApiLogger()) {
    if (!this.request) {
      throw new Error('Initialised request instance is required')
    }
  }

  static proxy (request) {
    return new Proxy(request, new RequestLoggingHandler(request))
  }

  get (target, key) {
    if (contains(httpCallMethods, key)) {
      const originalMethod = target[key]
      return (...args) => {
        this.handleLogging(key.toUpperCase(), asOptions(args[0]))
        return originalMethod.apply(this.request, args)
      }
    } else {
      return target[key]
    }
  }

  handleLogging (method, options) {
    this.apiLogger.logRequest({
      method: method,
      uri: options.uri,
      requestBody: options.body,
      query: options.qs,
      headers: options.headers
    })
    let originalCallback = intercept(options.callback)
    options.callback = (err, response, body) => {
      originalCallback(err, response, body)
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

function contains (array, value) {
  return array.indexOf(value) >= 0
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
    return param
  }
}

function intercept (callbackFunction) {
  return (err, response, body) => {
    if (callbackFunction) {
      callbackFunction(err, response, body)
    }
  }
}
