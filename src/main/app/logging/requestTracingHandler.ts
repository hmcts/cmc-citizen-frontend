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

  private setTracingHeaders (args: any[]): void {
    const firstArg = args[0]
    if (typeof firstArg === 'string' || firstArg instanceof String) {
      this.handleURIStringAsFirstArgumentCall(args)
    } else {
      this.handleOptionsAsFirstArgumentCall(args)
    }
  }

  private handleURIStringAsFirstArgumentCall (args: any[]): void {
    const options = this.extractOptionsObject(args)
    options.uri = args[0]
    if (options.headers === undefined) {
      options['headers'] = { }
    }
    this.addTracingHeaders(options.headers)
    args[0] = options
  }

  private extractOptionsObject (args: any[]): any {
    let options
    if (args[1] !== undefined) {
      options = args[1]
      delete args[1]
    } else {
      options = { }
    }
    return options
  }

  private handleOptionsAsFirstArgumentCall (args: any[]): void {
    const options = args[0]
    if (options.headers === undefined) {
      options['headers'] = { }
    }
    this.addTracingHeaders(options.headers)
  }

  private addTracingHeaders (headers: any): void {
    headers[Headers.ROOT_REQUEST_ID_HEADER] = this.requestTracing.getRootRequestId()
    headers[Headers.REQUEST_ID_HEADER] = this.requestTracing.createNextRequestId()
    headers[Headers.ORIGIN_REQUEST_ID_HEADER] = this.requestTracing.getCurrentRequestId()
  }
}
