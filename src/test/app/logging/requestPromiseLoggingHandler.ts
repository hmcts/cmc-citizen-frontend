/* tslint:disable:no-unused-expression */
import * as chai from 'chai'
import * as sinon from 'sinon'
import * as spies from 'sinon-chai'

chai.use(spies)
const expect = chai.expect

import { RequestLoggingHandler } from 'logging/requestPromiseLoggingHandler'
import { ApiLogger } from 'logging/apiLogger'

describe('RequestLoggingHandler', () => {
  let handler
  let proxy
  let options

  /* tslint:disable:no-empty allow empty for mocking */
  let requestPromise = {
    get: (options, extra) => { return { options, extra } },
    post: (options, extra) => { return { options, extra } },
    put: (options, extra) => { return { options, extra } },
    del: (options, extra) => { return { options, extra } },
    delete: (options, extra) => { return { options, extra } },
    patch: (options, extra) => { return { options, extra } },
    head: (options, extra) => { return { options, extra } },
    another: (options, extra) => { return { options, extra } }
  }

  let apiLogger = {
    logRequest: (requestData) => { },
    logResponse: (responseData) => { }
  }
  /* tslint:enable:no-empty */

  beforeEach(() => {
    options = {}
    handler = new RequestLoggingHandler(requestPromise, apiLogger as ApiLogger)
    proxy = new Proxy(requestPromise, handler)
  })

  it('should throw an error when initialised without request', () => {
    expect(() => new RequestLoggingHandler(undefined)).to.throw(Error)
  })

  describe('request-promise http calls proxy', () => {
    let logRequestCall

    beforeEach(() => {
      logRequestCall = sinon.spy(apiLogger, 'logRequest')
    })

    afterEach(() => {
      logRequestCall.restore()
    })

    const suiteParameters = [
      { paramName: 'options object', param: {} },
      { paramName: 'uri string', param: 'http://local.instance/some/path' },
      { paramName: 'uri and options', param: 'http://local.instance/some/path', extraParam: { headers: { 'X-Test': 'Test' } } }
    ]

    suiteParameters.forEach((suite) => {
      describe(`when passed an ${suite.paramName}`, () => {
        it('should handle logging on a get call', () => {
          const result = proxy.get(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
          if (suite.extraParam) {
            expect(result.extra).to.be.undefined
            expect(result.options.headers).to.equal(suite.extraParam.headers)
          }
        })

        it('should handle logging on a put call', () => {
          proxy.put(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a post call', () => {
          proxy.post(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a del call', () => {
          proxy.del(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a delete call', () => {
          proxy.delete(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a patch call', () => {
          proxy.patch(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should handle logging on a head call', () => {
          proxy.head(suite.param, suite.extraParam)
          expect(logRequestCall).to.have.been.called
        })

        it('should not handle logging on other calls', () => {
          proxy.another(suite.param, suite.extraParam)
          expect(logRequestCall).not.to.have.been.called
        })
      })
    })
  })

  describe('handleLogging', () => {
    let originalCallback

    beforeEach(() => {
      originalCallback = sinon.spy()
    })

    it('should assign a callback to the options object', () => {
      handler.handleLogging('any', options)
      // tslint:disable:disable-next-line no-unused-expression allow chai to be used without ()
      expect(options.callback).not.to.be.undefined
    })

    it('should override the originally assigned callback', () => {
      options.callback = originalCallback
      handler.handleLogging('any', options)

      expect(options.callback).not.to.equal(originalCallback)
    })

    it('should call the original callback defined in options object', () => {
      options.callback = originalCallback
      handler.handleLogging('any', options)
      options.callback()

      expect(originalCallback).to.have.been.called
    })
  })
})
