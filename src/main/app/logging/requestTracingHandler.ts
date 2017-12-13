import { RequestTracing, RequestTracingHeaders as Headers } from '@hmcts/nodejs-logging'

const httpCallMethods = ['get', 'post', 'put', 'patch', 'delete', 'del', 'head']

export class RequestTracingHandler {
  constructor (private request, private requestTracing = RequestTracing) {
    if (!this.request) {
      throw new Error('Initialised request instance is required')
    }
  }

  static proxy (request) {
    return new Proxy(request, new RequestTracingHandler(request))
  }

  get (target, key) {
    if (httpCallMethods.includes(key)) {
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
    headers[Headers.ROOT_REQUEST_ID_HEADER] = this.requestTracing.getRootRequestId()
    headers[Headers.REQUEST_ID_HEADER] = this.requestTracing.createNextRequestId()
    headers[Headers.ORIGIN_REQUEST_ID_HEADER] = this.requestTracing.getCurrentRequestId()
  }
}
