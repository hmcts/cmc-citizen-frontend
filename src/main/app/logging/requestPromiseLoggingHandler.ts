const httpCallMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head']

export class RequestLoggingHandler {
  constructor (public request, public apiLogger) {
    this.request = request
    this.apiLogger = apiLogger
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
      query: options.qs
    })
    let originalCallback = intercept(options.callback)
    options.callback = (err, response, body) => {
      originalCallback(err, response, body)
      this.apiLogger.logResponse({
        uri: options.uri,
        responseCode: ((response) ? response.statusCode : undefined),
        responseBody: body,
        error: err
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
