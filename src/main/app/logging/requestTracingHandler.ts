import * as logging from '@hmcts/nodejs-logging'

const RequestTracing = logging.RequestTracing

const httpCallMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head']

export class RequestTracingHandler {
  constructor (public request) {
    this.request = request
  }

  get (target, key) {
    if (contains(httpCallMethods, key)) {
      const originalMethod = target[key]
      return (...args) => {
        this.setTracingHeaders(args[0])
        return originalMethod.apply(this.request, args)
      }
    } else {
      return target[key]
    }
  }

  private setTracingHeaders (options: any): any {
    if (typeof options === 'string' || options instanceof String) {
      return {
        uri: options,
        headers: this.setTracingHeadersInternal({ })
      }
    } else {
      if (options.headers === undefined) {
        options['headers'] = { }
      }
      this.setTracingHeadersInternal(options.headers)
      return options
    }
  }

  private setTracingHeadersInternal (headers: any): void {
    headers['Root-Request-Id'] = RequestTracing.getRootRequestId()
    headers['Request-Id'] = RequestTracing.createNextRequestId()
    headers['Origin-Request-Id'] = RequestTracing.getCurrentRequestId()
  }
}

function contains (array, value) {
  return array.indexOf(value) >= 0
}
