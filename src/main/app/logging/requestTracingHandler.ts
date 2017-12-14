import { RequestTracing, RequestTracingHeaders as Headers } from '@hmcts/nodejs-logging'
import { HttpProxyCallInterceptor } from 'logging/httpProxyCallInterceptor'
import { RequestAPI } from 'client/request'

export class RequestTracingHandler {
  constructor (private request: RequestAPI, private requestTracing = RequestTracing) {
    if (!this.request) {
      throw new Error('Initialised request instance is required')
    }
  }

  static proxy<T extends RequestAPI> (request: T): T {
    return new Proxy(request, new RequestTracingHandler(request)) as T
  }

  get (target: Object, key: string) {
    return HttpProxyCallInterceptor.intercept(target, key, (callTarget: Object, methodName: string, methodArgs: any[]) => {
      this.setTracingHeaders(methodArgs)
    })
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
