import * as logging from '@hmcts/nodejs-logging'

const RequestTracing = logging.RequestTracing

const httpCallMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head']

export class RequestTracingHandler {
  constructor (private request, private requestTracing = RequestTracing) {
    if (!this.request || !this.requestTracing) {
      throw new Error('Initialised request instance is required')
    }
  }

  static proxy (request) {
    return new Proxy(request, new RequestTracingHandler(request))
  }

  get (target, key) {
    if (contains(httpCallMethods, key)) {
      const originalMethod = target[key]
      return (...args) => {
        this.setTracingHeaders(args)
        return originalMethod.apply(this.request, args)
      }
    } else {
      return target[key]
    }
  }

  private setTracingHeaders (args: any): void {
    const firstArg = args[0]
    if (typeof firstArg === 'string' || firstArg instanceof String) {
      let options
      if (args[1] !== undefined) {
        options = args[1]
      } else {
        options = { }
      }
      options.uri = firstArg
      if (options.headers === undefined) {
        options['headers'] = { }
      }
      this.setTracingHeadersInternal(options.headers)
      args[0] = options
      delete args[1]
    } else {
      if (firstArg.headers === undefined) {
        firstArg['headers'] = { }
      }
      this.setTracingHeadersInternal(firstArg.headers)
    }
  }

  private setTracingHeadersInternal (headers: any): void {
    headers['Root-Request-Id'] = this.requestTracing.getRootRequestId()
    headers['Request-Id'] = this.requestTracing.createNextRequestId()
    headers['Origin-Request-Id'] = this.requestTracing.getCurrentRequestId()
  }
}

function contains (array, value) {
  return array.indexOf(value) >= 0
}
